import React, { useState } from 'react';
import YouMayAlsoLike from './componentes/upsellwidthpreview';
import { useAppBridge } from '@shopify/app-bridge-react';


const CrossSellEditor: React.FC = () => {
  const [offerName, setOfferName] = useState<string>('Cross-sell with selected products');
  const shopify = useAppBridge();
  const openProductPicker = async () => {
    const selected = await shopify.resourcePicker({
      type: 'product',
      multiple: false,
    });

  }

  return (
    <s-page heading='Upsell & Cross Sell'>


      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">

        {/*Left site design section  */}
        <s-grid-item gridColumn="span 5" gridRow="span 1">

          <s-section heading='Offer name' >
            <s-text-field
              value={offerName}
              placeholder="offer name"

            ></s-text-field>
          </s-section>

          {/* Customer gets */}
          <s-stack paddingBlockStart='base'>

            <s-section heading='Customer buys'>
              <s-choice-list

              // onChange="handleChange(event)"
              >
                <s-choice selected value="Any product">Any product</s-choice>
                <s-choice value="">
                  Specific products</s-choice>
                <s-choice value="Products in specific collection">Products in specific collection</s-choice>
              </s-choice-list>

              <s-grid paddingBlockStart='base' gridTemplateColumns="repeat(12, 1fr)" gap="base">
                <s-grid-item gridColumn="span 9" gridRow="span 3">    <s-search-field

                  label="Search"
                  labelAccessibilityVisibility="exclusive"
                  placeholder="Search Products"
                  onInput={openProductPicker}
                ></s-search-field></s-grid-item>

                <s-grid-item gridColumn="span 2" gridRow="span 3">     <s-button onClick={openProductPicker}>
                  Brawse
                </s-button></s-grid-item>

              </s-grid>
            </s-section>

          </s-stack>
          
          {/* Customer buys */}
          <s-stack paddingBlockStart='base'>

            <s-section heading='Customer gets'>
              <s-choice-list

              // onChange="handleChange(event)"
              >
                <s-choice value="Specific products">
                  Specific products</s-choice>
                <s-choice value="">Frequently bought together</s-choice>
              </s-choice-list>

              <s-grid paddingBlockStart='base' gridTemplateColumns="repeat(12, 1fr)" gap="base">
                <s-grid-item gridColumn="span 9" gridRow="span 3">    <s-search-field

                  label="Search"
                  labelAccessibilityVisibility="exclusive"
                  placeholder="Search Products"
                  onInput={openProductPicker}
                ></s-search-field></s-grid-item>

                <s-grid-item gridColumn="span 2" gridRow="span 3">     <s-button onClick={openProductPicker}>
                  Brawse
                </s-button></s-grid-item>

              </s-grid>
            </s-section>

          </s-stack>
          
         {/* Discount */}
          <s-stack paddingBlockStart='base'>

            <s-section heading='Discount'>
              <s-choice-list

              // onChange="handleChange(event)"
              >
                <s-choice value="No Discount">
                 No Discount</s-choice>
                <s-choice value="Percentage">
                  Percentage</s-choice>
                  <s-choice value="Fixed Amount">
                  Fixed Amount</s-choice>
              </s-choice-list>

              <s-grid paddingBlockStart='base' gridTemplateColumns="repeat(12, 1fr)" gap="base">
                <s-grid-item gridColumn="span 9" gridRow="span 3">    <s-search-field

                  label="Search"
                  labelAccessibilityVisibility="exclusive"
                  placeholder="Search Products"
                  onInput={openProductPicker}
                ></s-search-field></s-grid-item>

                <s-grid-item gridColumn="span 2" gridRow="span 3">     <s-button onClick={openProductPicker}>
                  Brawse
                </s-button></s-grid-item>

              </s-grid>
            </s-section>

          </s-stack>

        </s-grid-item>

        {/* Right site Preview  section */}
        <s-grid-item gridColumn="span 7" gridRow="span 1">
          <s-section>
            <YouMayAlsoLike />
          </s-section>
        </s-grid-item>
      </s-grid>

    </s-page>
  );
};

export default CrossSellEditor;