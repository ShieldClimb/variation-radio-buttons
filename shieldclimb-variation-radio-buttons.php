<?php

/**
 * Plugin Name: ShieldClimb – Variation Radio Buttons with Price & Stock for WooCommerce
 * Plugin URI: https://shieldclimb.com/free-woocommerce-plugins/variation-radio-buttons/
 * Description: Replace WooCommerce variation dropdowns with variation radio buttons for better UX, faster selection, and higher conversions. No coding needed!
 * Version: 1.0.0
 * Requires Plugins: woocommerce
 * Requires at least: 5.8
 * Tested up to: 6.7
 * WC requires at least: 5.8
 * WC tested up to: 9.7.1
 * Requires PHP: 7.2
 * Author: shieldclimb.com
 * Author URI: https://shieldclimb.com/about-us/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function shieldclimb_variation_radio_buttons() {
      add_action( 'wp_print_footer_scripts', function() {
   
          ?>
          <script type="text/javascript">
   
          // DOM Loaded
          document.addEventListener( 'DOMContentLoaded', function() {
    
              // Get Variation Pricing Data
              var variations_form = document.querySelector( 'form.variations_form' );
              var data = variations_form.getAttribute( 'data-product_variations' );
              data = JSON.parse( data );
   
              // Loop Drop Downs
              document.querySelectorAll( 'table.variations select' )
                  .forEach( function( select ) {
   
                  // Loop Drop Down Options
                  select.querySelectorAll( 'option' )
                      .forEach( function( option ) {
   
                      // Skip Empty
                      if( ! option.value ) {
                          return;
                      }
   
                      // Get Pricing and Stock qty For This Option
                      var pricing = '';
                                var stockQuantity = '';
                      data.forEach( function( row ) {
                          if( row.attributes[select.name] == option.value ) {
                              pricing = row.price_html;
                                            stockQuantity = row.max_qty;
                          }
                      } );
   
                                // Show "0" if stock is empty or zero
                      if (stockQuantity === '' || stockQuantity === 0) {
                          stockQuantity = 0;
                                option.disabled = true; // Disable the option
                      }
                                
                      // Create Radio
                      var radio = document.createElement( 'input' );
                          radio.type = 'radio';
                          radio.name = select.name;
                          radio.value = option.value;
                          radio.checked = option.selected;
                                      radio.disabled = (stockQuantity === 0); // Disable radio if stock is zero
                      var label = document.createElement( 'label' );
                          label.appendChild( radio );
                          label.appendChild( document.createTextNode( ' ' + option.text + ' ' ) );
                      var span = document.createElement( 'span' );
                          span.innerHTML = pricing + ' (Stocks: ' + stockQuantity + ')<br>';
                          label.appendChild( span );
                      var div = document.createElement( 'div' );
                          div.className = "radioButton";
                          div.appendChild( label );
   
                      // Insert Radio
                      select.closest( 'td' ).className = "variationButtons";
                      select.closest( 'td' ).appendChild( div );
   
                      // Handle Clicking
                      radio.addEventListener( 'click', function( event ) {
                          select.value = radio.value;
                          jQuery( select ).trigger( 'change' );
                      } );
   
                  } ); // End Drop Down Options Loop
   
                  // Hide Drop Down
                  select.style.display = 'none';
   
              } ); // End Drop Downs Loop
    
          } ); // End Document Loaded
   
          </script>
               <style>
              .variationButtons .radioButton {
                  display: block; /* Ensures each radio button is displayed in a block layout */
                  margin-bottom: 0px; /* Adds space between the radio buttons */
                          width: 100%;
  
              }
  
              .variationButtons {
                           width: 100%;
  
              }
  
              .radioButton label {
                  display: block;
                          width: 100%;
              }
        
          </style>
          <?php
   
      } );
  }
  add_action( 'woocommerce_variable_add_to_cart', 'shieldclimb_variation_radio_buttons' );

?>