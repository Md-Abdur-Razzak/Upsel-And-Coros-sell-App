import React, { useState } from "react";
import YouMayAlsoLike, {
  type PreviewProduct,
} from "./componentes/upsellwidthpreview";
import { useAppBridge } from "@shopify/app-bridge-react";

type CustomerBuysType =
  | "Any product"
  | "Specific products"
  | "Products in specific collection";

type CustomerGetsType = "Specific products" | "Frequently bought together";

type DiscountType = "No Discount" | "Percentage" | "Fixed Amount";

type ChoiceListElement = HTMLElement & { values?: string[] };

type PickerImage = {
  originalSrc?: string;
};

type PickerSelection = {
  id: string;
  title?: string;
  handle?: string;
  image?: PickerImage | null;
  images?: PickerImage[];
  variants?: Array<{
    title?: string;
    displayName?: string;
    selectedOptions?: Array<{
      value?: string | null;
    }>;
  }>;
};

type PickerResult = (
  | PickerSelection[]
  | {
      selection?: PickerSelection[];
    }
) & {
  selection?: PickerSelection[];
};

type SelectedResource = {
  id: string;
  title: string;
  image: string;
  variants: string[];
};

const CrossSellEditor: React.FC = () => {
  // Main offer title shown at the top of the editor.
  const [offerName, setOfferName] = useState<string>(
    "Cross-sell with selected products",
  );
  // Active rule for the "Customer buys" section.
  const [customerBuysType, setCustomerBuysType] =
    useState<CustomerBuysType>("Any product");

  // Active rule for the "Customer gets" section.
  const [customerGetsType, setCustomerGetsType] =
    useState<CustomerGetsType>("Specific products");
  // Discount mode and numeric value entered by the merchant.
  const [discountType, setDiscountType] = useState<DiscountType>("No Discount");
  const [discountValue, setDiscountValue] = useState<string>("");

  // Separate resource stores so product and collection selections can be kept independently.
  const [customerBuysProducts, setCustomerBuysProducts] = useState<
    SelectedResource[]
  >([]);
  const [customerBuysCollections, setCustomerBuysCollections] = useState<
    SelectedResource[]
  >([]);
  const [customerGetsProducts, setCustomerGetsProducts] = useState<
    SelectedResource[]
  >([]);

  const shopify = useAppBridge();

  // Converts Shopify resource picker output into our local selected-resource shape.
  const normalizePickerSelection = (
    selected: PickerResult | undefined,
  ): SelectedResource[] => {
    const items = Array.isArray(selected)
      ? selected
      : (selected?.selection ?? []);

    return items.map((item) => ({
      id: item.id,
      title: item.title ?? item.handle ?? "Untitled",
      image: item.images?.[0]?.originalSrc ?? item.image?.originalSrc ?? "",
      variants:
        item.variants
          ?.map(
            (variant) =>
              variant.title ??
              variant.displayName ??
              variant.selectedOptions
                ?.map((option) => option.value)
                .filter(Boolean)
                .join(" / "),
          )
          .filter(
            (variant): variant is string =>
              Boolean(variant) &&
              variant.trim().toLowerCase() !== "default title",
          ) ?? [],
    }));
  };

  // Opens the picker for "Customer buys" and reuses old selections as preselected values.
  const openCustomerBuysPicker = async () => {
    const resourceType =
      customerBuysType === "Products in specific collection"
        ? "collection"
        : "product";

    const selectionIds =
      resourceType === "collection"
        ? customerBuysCollections.map(({ id }) => ({ id }))
        : customerBuysProducts.map(({ id }) => ({ id }));

    const selected = (await shopify.resourcePicker({
      type: resourceType,
      multiple: true,
      selectionIds,
    })) as PickerResult | undefined;

    const normalizedSelection = normalizePickerSelection(selected);

    if (normalizedSelection.length > 0) {
      if (resourceType === "collection") {
        setCustomerBuysCollections(normalizedSelection);
      } else {
        setCustomerBuysProducts(normalizedSelection);
      }
    }
  };

  // Opens the picker for "Customer gets" and keeps previous selections selected.
  const openCustomerGetsPicker = async () => {
    const selected = (await shopify.resourcePicker({
      type: "product",
      multiple: true,
      selectionIds: customerGetsProducts.map(({ id }) => ({ id })),
    })) as PickerResult | undefined;

    const normalizedSelection = normalizePickerSelection(selected);

    if (normalizedSelection.length > 0) {
      setCustomerGetsProducts(normalizedSelection);
    }
  };

  // Handles option changes inside the "Customer buys" choice list.
  const handleCustomerBuysChange = (
    event: React.FormEvent<ChoiceListElement>,
  ) => {
    const value = event.currentTarget.values?.[0];

    if (
      value === "Any product" ||
      value === "Specific products" ||
      value === "Products in specific collection"
    ) {
      setCustomerBuysType(value);
    }
  };

  // Handles option changes inside the "Customer gets" choice list.
  const handleCustomerGetsChange = (
    event: React.FormEvent<ChoiceListElement>,
  ) => {
    const value = event.currentTarget.values?.[0];

    if (
      value === "Specific products" ||
      value === "Frequently bought together"
    ) {
      setCustomerGetsType(value);
    }
  };

  // Changes discount mode and clears the old numeric input when the type changes.
  const handleDiscountTypeChange = (
    event: React.FormEvent<ChoiceListElement>,
  ) => {
    const value = event.currentTarget.values?.[0];

    if (
      value === "No Discount" ||
      value === "Percentage" ||
      value === "Fixed Amount"
    ) {
      setDiscountType(value);
      setDiscountValue("");
    }
  };

  // These booleans control when resource-picker UI blocks should be visible.
  const showCustomerBuysPicker =
    customerBuysType === "Specific products" ||
    customerBuysType === "Products in specific collection";

  const showCustomerGetsPicker = customerGetsType === "Specific products";
  // Chooses which selected list to show based on the current "Customer buys" mode.
  const activeCustomerBuysSelections =
    customerBuysType === "Products in specific collection"
      ? customerBuysCollections
      : customerBuysProducts;

  // Builds the compact text shown inside the picker search field.
  const getSelectionSummary = (items: SelectedResource[]): string =>
    items.length === 0
      ? ""
      : items.length === 1
        ? items[0].title
        : `${items.length} items selected`;

  // Removes a single selected resource from the active "Customer buys" list.
  const removeCustomerBuysSelection = (id: string): void => {
    if (customerBuysType === "Products in specific collection") {
      setCustomerBuysCollections((current) =>
        current.filter((item) => item.id !== id),
      );
      return;
    }

    setCustomerBuysProducts((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  // Removes a single selected product from "Customer gets".
  const removeCustomerGetsSelection = (id: string): void => {
    setCustomerGetsProducts((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  // Only "Specific products" should affect the right-side live preview.
  const previewProducts: PreviewProduct[] =
    customerGetsType === "Specific products" ? customerGetsProducts : [];

  return (
    <s-page heading="Upsell & Cross Sell">
      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
        {/* Left editor panel */}
        <s-grid-item gridColumn="span 5" gridRow="span 1">
          {/* Offer title input */}
          <s-section heading="Offer name">
            <s-text-field
              value={offerName}
              placeholder="offer name"
            ></s-text-field>
          </s-section>

          {/* Customer buys configuration */}
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
                <>
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
                        value={getSelectionSummary(
                          activeCustomerBuysSelections,
                        )}
                        onClick={openCustomerBuysPicker}
                      ></s-search-field>
                    </s-grid-item>

                    <s-grid-item gridColumn="span 3" gridRow="span 3">
                      <s-button onClick={openCustomerBuysPicker}>
                        Browse
                      </s-button>
                    </s-grid-item>
                  </s-grid>

                  {activeCustomerBuysSelections.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                        marginTop: "12px",
                      }}
                    >
                      {activeCustomerBuysSelections.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            border: "1px solid #dfe3e8",
                            borderRadius: "12px",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                width: "44px",
                                height: "44px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, #eef2f6 0%, #dde5ec 100%)",
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#111827",
                              }}
                            >
                              {item.title}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomerBuysSelection(item.id)}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#6b7280",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </s-section>
          </s-stack>

          {/* Customer gets configuration */}
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
                <>
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
                        value={getSelectionSummary(customerGetsProducts)}
                        onClick={openCustomerGetsPicker}
                      ></s-search-field>
                    </s-grid-item>

                    <s-grid-item gridColumn="span 3" gridRow="span 3">
                      <s-button onClick={openCustomerGetsPicker}>
                        Browse
                      </s-button>
                    </s-grid-item>
                  </s-grid>

                  {customerGetsProducts.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                        marginTop: "12px",
                      }}
                    >
                      {customerGetsProducts.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            border: "1px solid #dfe3e8",
                            borderRadius: "12px",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                width: "44px",
                                height: "44px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, #eef2f6 0%, #dde5ec 100%)",
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#111827",
                              }}
                            >
                              {item.title}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomerGetsSelection(item.id)}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#6b7280",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </s-section>
          </s-stack>

          {/* Discount rule and conditional number input */}
          <s-stack paddingBlockStart="base">
            <s-section heading="Discount">
              <s-choice-list onChange={handleDiscountTypeChange}>
                <s-choice
                  value="No Discount"
                  selected={discountType === "No Discount"}
                >
                  No Discount
                </s-choice>
                <s-choice
                  value="Percentage"
                  selected={discountType === "Percentage"}
                >
                  Percentage
                </s-choice>
                <s-choice
                  value="Fixed Amount"
                  selected={discountType === "Fixed Amount"}
                >
                  Fixed Amount
                </s-choice>
              </s-choice-list>

              {discountType !== "No Discount" ? (
                <div style={{ paddingTop: "12px" }}>
                  <input
                    type="number"
                    min="0"
                    step={discountType === "Percentage" ? "1" : "0.01"}
                    value={discountValue}
                    onChange={(event) => setDiscountValue(event.target.value)}
                    placeholder={
                      discountType === "Percentage"
                        ? "Enter percentage"
                        : "Enter amount"
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid #c9cccf",
                      borderRadius: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ) : null}
            </s-section>
          </s-stack>

          {/* Schedule inputs */}
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
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #f6f6f7 100%)",
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
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #f6f6f7 100%)",
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

        {/* Right-side live preview */}
        <s-grid-item gridColumn="span 7" gridRow="span 1">
          <s-section>
            <YouMayAlsoLike selectedProducts={previewProducts} />
          </s-section>
        </s-grid-item>
      </s-grid>
    </s-page>
  );
};

export default CrossSellEditor;
