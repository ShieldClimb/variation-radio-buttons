document.addEventListener('DOMContentLoaded', function() {
    const variationsForm = document.querySelector('form.variations_form');
    if (!variationsForm) return;
    
    let variationData = [];
    try {
        const variationString = variationsForm.getAttribute('data-product_variations') || '[]';
        variationData = JSON.parse(variationString);
    } catch (error) {
        console.error('Variation data error:', error);
        return;
    }
    
    document.querySelectorAll('table.variations select').forEach(select => {
        const wrapper = document.createElement('div');
        wrapper.className = 'variation-radio-wrapper';
        
        Array.from(select.options).forEach(option => {
            if (!option.value) return;
            
            const variation = variationData.find(row => 
                row.attributes[select.name] === option.value
            );
            
            // FIX FOR UNLIMITED STOCK
            const isInStock = variation?.is_in_stock || false;
            const stockQty = variation?.max_qty || 0;
            const actualStock = isInStock ? 
                (stockQty > 0 ? stockQty : 'unlimited') : 
                0;
            
            const priceHTML = variation?.price_html || '';
            
            const container = document.createElement('div');
            container.className = 'variation-radio-option';
            if (actualStock === 0) container.classList.add('disabled');
            if (option.selected) container.classList.add('selected');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = select.name + '_radio';
            radio.value = option.value;
            radio.id = `radio_${select.name}_${option.value}`;
            radio.checked = option.selected;
            radio.disabled = (actualStock === 0);
            
            const radioIndicator = document.createElement('span');
            radioIndicator.className = 'radio-indicator';
            
            const label = document.createElement('label');
            label.htmlFor = radio.id;
            
            const content = document.createElement('div');
            content.className = 'option-content';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = option.text;
            
            const priceStock = document.createElement('div');
            priceStock.className = 'price-stock';
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'price';
            
            const priceContainer = document.createElement('span');
            priceContainer.className = 'price-container';
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = priceHTML || '';
            
            const delElement = tempDiv.querySelector('del');
            const insElement = tempDiv.querySelector('ins');
            
            if (delElement && insElement) {
                const orderedContainer = document.createElement('span');
                orderedContainer.appendChild(delElement.cloneNode(true));
                orderedContainer.appendChild(insElement.cloneNode(true));
                priceContainer.appendChild(orderedContainer);
            } else {
                priceContainer.innerHTML = priceHTML || '';
            }
            
            // UPDATED STOCK DISPLAY
            const stockSpan = document.createElement('span');
            stockSpan.className = 'stock';
            
            if (actualStock === 0) {
                stockSpan.textContent = '(Out of stock)';
            } else if (actualStock === 'unlimited') {
                stockSpan.textContent = '(In stock)';
            } else {
                stockSpan.textContent = `(${actualStock} in stock)`;
            }
            
            priceSpan.appendChild(priceContainer);
            priceStock.appendChild(priceSpan);
            priceStock.appendChild(stockSpan);
            content.appendChild(textSpan);
            content.appendChild(priceStock);
            label.appendChild(content);
            container.appendChild(radio);
            container.appendChild(radioIndicator);
            container.appendChild(label);
            wrapper.appendChild(container);
            
            container.addEventListener('click', function(e) {
                if (!container.classList.contains('disabled')) {
                    radio.checked = true;
                    select.value = radio.value;
                    const event = new Event('change', { bubbles: true });
                    select.dispatchEvent(event);
                    if (typeof jQuery !== 'undefined') {
                        jQuery(select).trigger('change');
                    }
                    wrapper.querySelectorAll('.variation-radio-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    container.classList.add('selected');
                }
            });
        });
        
        const td = select.closest('td');
        td.classList.add('variation-radio-container');
        
        const resetLink = td.querySelector('.reset_variations');
        if (resetLink) {
            td.insertBefore(wrapper, resetLink);
        } else {
            td.appendChild(wrapper);
        }
        
        select.style.display = 'none';
    });
    
    setTimeout(() => {
        if (typeof jQuery !== 'undefined') {
            jQuery(variationsForm).trigger('check_variations');
            if (typeof jQuery.fn.wc_variation_form !== 'undefined') {
                jQuery(variationsForm).wc_variation_form();
            }
        }
    }, 1000);
});