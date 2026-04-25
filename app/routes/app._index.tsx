import React, { useState } from 'react';
import YouMayAlsoLike from './componentes/upsellwidthpreview';
import { SaveBar } from "@shopify/app-bridge-react";

const CrossSellEditor: React.FC = () => {
  const [offerName, setOfferName] = useState<string>('Cross-sell with selected products');
  if(1 == 1){
    shopify.saveBar.show('hello');
  }
  return (
    <s-page heading='Upsell & Cross Sell'>
      <SaveBar id='hello'>
        <s-button variant='primary' onClick={() => console.log('Save button clicked')}>Save</s-button>
        <s-button variant='secondary' onClick={() => console.log('Cancel button clicked')}>Cancel</s-button>
      </SaveBar>

      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">

        {/*Left site design section  */}
        <s-grid-item gridColumn="span 5" gridRow="span 1">
          <s-section heading='Offer name' >
            <s-text-field
              value={offerName}
              placeholder="offer name"
            ></s-text-field>
          </s-section>

            <s-section heading='Offer name' >
            <s-text-field
              value={offerName}
              placeholder="offer name"
            ></s-text-field>
          </s-section>

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