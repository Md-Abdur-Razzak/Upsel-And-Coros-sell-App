import React, { useState } from "react";
import YouMayAlsoLike from "./componentes/upsellwidthpreview";
import { useAppBridge } from "@shopify/app-bridge-react";

type CustomerBuysType =
  | "Any product"
  | "Specific products"
  | "Products in specific collection";

type CustomerGetsType =
  | "Specific products"
  | "Frequently bought together";

type ChoiceListElement = HTMLElement & { values?: string[] };

type PickerSelection = {
  title?: string;
  handle?: string;
};

type PickerResult =
  | PickerSelection[]
  | {
      selection?: PickerSelection[];
    }
  | undefined;

const CrossSellEditor: React.FC = () => {
  const [offerName, setOfferName] = useState<string>(
    "Cross-sell with selected products",
  );
  const [customerBuysType, setCustomerBuysType] =
    useState<CustomerBuysType>("Any product");
  const [customerGetsType, setCustomerGetsType] =
    useState<CustomerGetsType>("Specific products");
  const [customerBuysSelection, setCustomerBuysSelection] = useState<string>("");
  const [customerGetsSelection, setCustomerGetsSelection] = useState<string>("");
  const shopify = useAppBridge();

  const getPickerSelectionTitle = (selected: PickerResult): string => {
    if (Array.isArray(selected)) {
      return selected[0]?.title ?? selected[0]?.handle ?? "";
    }

    return selected?.selection?.[0]?.title ?? selected?.selection?.[0]?.handle ?? "";
  };

  const openCustomerBuysPicker = async () => {
    const resourceType =
      customerBuysType === "Products in specific collection"
        ? "collection"
        : "product";

    const selected = (await shopify.resourcePicker({
      type: resourceType,
      multiple: false,
    })) as PickerResult;

    const selectedTitle = getPickerSelectionTitle(selected);

    if (selectedTitle) {
      setCustomerBuysSelection(selectedTitle);
    }
  };

  const openCustomerGetsPicker = async () => {
    const selected = (await shopify.resourcePicker({
      type: "product",
      multiple: false,
    })) as PickerResult;

    const selectedTitle = getPickerSelectionTitle(selected);

    if (selectedTitle) {
      setCustomerGetsSelection(selectedTitle);
    }
  };

  const handleCustomerBuysChange = (event: React.FormEvent<ChoiceListElement>) => {
    const value = event.currentTarget.values?.[0];

    if (
      value === "Any product" ||
      value === "Specific products" ||
      value === "Products in specific collection"
    ) {
      setCustomerBuysType(value);
    }
  };

  const handleCustomerGetsChange = (event: React.FormEvent<ChoiceListElement>) => {
    const value = event.currentTarget.values?.[0];

    if (
      value === "Specific products" ||
      value === "Frequently bought together"
    ) {
      setCustomerGetsType(value);
    }
  };

  const showCustomerBuysPicker =
    customerBuysType === "Specific products" ||
    customerBuysType === "Products in specific collection";

  const showCustomerGetsPicker = customerGetsType === "Specific products";

  return (
    <s-page heading="Upsell & Cross Sell">
      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
        {/*Left site design section  */}
        <s-grid-item gridColumn="span 5" gridRow="span 1">
          <s-section heading="Offer name">
            <s-text-field
              value={offerName}
              placeholder="offer name"
            ></s-text-field>
          </s-section>

          {/* Customer gets */}
          <s-stack paddingBlockStart="base">
            <s-section heading="Customer buys">
              <s-choice-list onChange={handleCustomerBuysChange}>
                <s-choice
                  selected={customerBuysType === "Any product"}
                  value="Any product"
              
                  
                >
                  Any product
                </s-choice>
                <s-choice
                  selected={customerBuysType === "Specific products"}
                  value="Specific products"
                 
                >
                  Specific products
                </s-choice>
                <s-choice
                  selected={
                    customerBuysType === "Products in specific collection"
                  }
                  value="Products in specific collection"
                
                >
                  Products in specific collection
                </s-choice>
              </s-choice-list>

              {showCustomerBuysPicker ? (
                <s-grid
                  paddingBlockStart="base"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap="base"
                >
                  <s-grid-item gridColumn="span 9" gridRow="span 3">
                    <s-search-field
                      label="Search"
                      labelAccessibilityVisibility="exclusive"
                      placeholder={
                        customerBuysType === "Products in specific collection"
                          ? "Select collection"
                          : "Select products"
                      }
                      value={customerBuysSelection}
                      onClick={openCustomerBuysPicker}
                    ></s-search-field>
                  </s-grid-item>

                  <s-grid-item gridColumn="span 3" gridRow="span 3">
                    <s-button onClick={openCustomerBuysPicker}>Browse</s-button>
                  </s-grid-item>
                </s-grid>
              ) : null}
            </s-section>
          </s-stack>

          {/* Customer buys */}
          <s-stack paddingBlockStart="base">
            <s-section heading="Customer gets">
              <s-choice-list onChange={handleCustomerGetsChange}>
                <s-choice
                  selected={customerGetsType === "Specific products"}
                  value="Specific products"
                  // onInput={() => setCustomerGetsType("Specific products")}
                >
                  Specific products
                </s-choice>
                <s-choice
                  selected={customerGetsType === "Frequently bought together"}
                  value="Frequently bought together"
                 >
                
                  Frequently bought together
                </s-choice>
              </s-choice-list>

              {showCustomerGetsPicker ? (
                <s-grid
                  paddingBlockStart="base"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap="base"
                >
                  <s-grid-item gridColumn="span 9" gridRow="span 3">
                    <s-search-field
                      label="Search"
                      labelAccessibilityVisibility="exclusive"
                      placeholder="Select products"
                      value={customerGetsSelection}
                      onClick={openCustomerGetsPicker}
                    ></s-search-field>
                  </s-grid-item>

                  <s-grid-item gridColumn="span 3" gridRow="span 3">
                    <s-button onClick={openCustomerGetsPicker}>Browse</s-button>
                  </s-grid-item>
                </s-grid>
              ) : null}
            </s-section>
          </s-stack>

          {/* Discount */}
          <s-stack paddingBlockStart="base">
            <s-section heading="Discount">
              <s-choice-list

              // onChange="handleChange(event)"
              >
                <s-choice value="No Discount">No Discount</s-choice>
                <s-choice value="Percentage">Percentage</s-choice>
                <s-choice value="Fixed Amount">Fixed Amount</s-choice>
              </s-choice-list>

              <s-grid
                paddingBlockStart="base"
                gridTemplateColumns="repeat(12, 1fr)"
                gap="base"
              >
                <s-grid-item gridColumn="span 9" gridRow="span 3">
                  {" "}
                  <s-search-field
                    label="Search"
                    labelAccessibilityVisibility="exclusive"
                    placeholder="Search Products"
                    onInput={openCustomerGetsPicker}
                  ></s-search-field>
                </s-grid-item>

                <s-grid-item gridColumn="span 2" gridRow="span 3">
                  {" "}
                  <s-button onClick={openCustomerGetsPicker}>Brawse</s-button>
                </s-grid-item>
              </s-grid>
            </s-section>
          </s-stack>

          {/* Schedule */}
          <s-stack paddingBlockStart="base">
            {" "}
            <s-section heading="Schedule ">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: "16px",
                  
                  padding: "14px",
                  border: "1px solid #dfe3e8",
                  borderRadius: "14px",
                  background: "linear-gradient(180deg, #ffffff 0%, #f6f6f7 100%)",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#44546f",
                    }}
                  >
                    Start date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "12px 14px",
                      border: "1px solid #c9cccf",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      boxShadow: "inset 0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#44546f",
                    }}
                  >
                    Custom time
                  </label>
                  <input
                    type="time"
                    name="customTime"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "12px 14px",
                      border: "1px solid #c9cccf",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      boxShadow: "inset 0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: "16px",
                  marginTop: "16px",
                  padding: "14px",
                  border: "1px solid #dfe3e8",
                  borderRadius: "14px",
                  background: "linear-gradient(180deg, #ffffff 0%, #f6f6f7 100%)",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#44546f",
                    }}
                  >
                    End date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "12px 14px",
                      border: "1px solid #c9cccf",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      boxShadow: "inset 0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#44546f",
                    }}
                  >
                    Custom time
                  </label>
                  <input
                    type="time"
                    name="customTime"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      padding: "12px 14px",
                      border: "1px solid #c9cccf",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      boxShadow: "inset 0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                  />
                </div>
              </div>
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
