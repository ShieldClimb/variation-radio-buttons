document.addEventListener('DOMContentLoaded', function() {
    // Only run on product pages with variations
    const variationsForm = document.querySelector('form.variations_form');
    if (!variationsForm) return;
    
    // Get variation data
    let variationData = [];
    try {
        const variationString = variationsForm.getAttribute('data-product_variations') || '[]';
        variationData = JSON.parse(variationString);
    } catch (error) {
        console.error('Variation data error:', error);
        return;
    }
    
    // Create radio buttons for each variation dropdown
    document.querySelectorAll('table.variations select').forEach(select => {
        // Create wrapper container
        const wrapper = document.createElement('div');
        wrapper.className = 'variation-radio-wrapper';
        
        // Create options for each variation
        Array.from(select.options).forEach(option => {
            if (!option.value) return; // Skip placeholder option
            
            // Find matching variation data
            const variation = variationData.find(row => 
                row.attributes[select.name] === option.value
            );
            
            // Get stock and price info
            const stockQty = variation?.max_qty || 0;
            const priceHTML = variation?.price_html || '';
            
            // Create radio button container
            const container = document.createElement('div');
            container.className = 'variation-radio-option';
            if (stockQty <= 0) container.classList.add('disabled');
            if (option.selected) container.classList.add('selected');
            
            // Create radio input
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = select.name + '_radio';
            radio.value = option.value;
            radio.id = `radio_${select.name}_${option.value}`;
            radio.checked = option.selected;
            radio.disabled = stockQty <= 0;
            
            // Create custom radio indicator
            const radioIndicator = document.createElement('span');
            radioIndicator.className = 'radio-indicator';
            
            // Create label wrapper (makes entire box clickable)
            const label = document.createElement('label');
            label.htmlFor = radio.id;
            
            // Create content container
            const content = document.createElement('div');
            content.className = 'option-content';
            
            // Create text label
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = option.text;
            
            // Create price/stock container
            const priceStock = document.createElement('div');
            priceStock.className = 'price-stock';
            
            // Create price element
            const priceSpan = document.createElement('span');
            priceSpan.className = 'price';
            priceSpan.innerHTML = priceHTML || '';
            
            // Create stock element
            const stockSpan = document.createElement('span');
            stockSpan.className = 'stock';
            stockSpan.textContent = stockQty > 0 ? `(${stockQty} in stock)` : '(Out of stock)';
            
            // Assemble elements
            priceStock.appendChild(priceSpan);
            priceStock.appendChild(stockSpan);
            content.appendChild(textSpan);
            content.appendChild(priceStock);
            label.appendChild(content);
            container.appendChild(radio);
            container.appendChild(radioIndicator); // Radio indicator added here
            container.appendChild(label);
            wrapper.appendChild(container);
            
            // Add event listener to the container
            container.addEventListener('click', function(e) {
                if (!container.classList.contains('disabled')) {
                    // Update radio state
                    radio.checked = true;
                    
                    // Update original select value
                    select.value = radio.value;
                    
                    // Trigger WooCommerce's variation change event
                    const event = new Event('change', { bubbles: true });
                    select.dispatchEvent(event);
                    
                    // Trigger jQuery event for WooCommerce
                    if (typeof jQuery !== 'undefined') {
                        jQuery(select).trigger('change');
                    }
                    
                    // Update visual selection
                    wrapper.querySelectorAll('.variation-radio-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    container.classList.add('selected');
                }
            });
        });
        
        // Insert after the original select
        const td = select.closest('td');
        td.classList.add('variation-radio-container');
        
        // Insert wrapper before the reset link if it exists
        const resetLink = td.querySelector('.reset_variations');
        if (resetLink) {
            td.insertBefore(wrapper, resetLink);
        } else {
            td.appendChild(wrapper);
        }
        
        // Hide original dropdown
        select.style.display = 'none';
    });
    
    // Force WooCommerce to recheck variations
    setTimeout(() => {
        if (typeof jQuery !== 'undefined') {
            jQuery(variationsForm).trigger('check_variations');
            
            // Additional check for newer WooCommerce versions
            if (typeof jQuery.fn.wc_variation_form !== 'undefined') {
                jQuery(variationsForm).wc_variation_form();
            }
        }
    }, 1000);
});