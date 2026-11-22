export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Atelier Product Catalogue API",
    version: "1.0.0",
    description: "Backend API for catalogue browsing and product enquiries.",
  },
  servers: [{ url: "/api", description: "Current server" }],
  tags: [
    { name: "Catalogue", description: "Browse and search products" },
    { name: "Enquiries", description: "Submit product enquiries" },
  ],
  paths: {
    "/products/featured": {
      get: {
        tags: ["Catalogue"],
        summary: "Get five featured products",
        description:
          "Returns the five highest-rated products in the catalogue.",
        responses: {
          "200": {
            description: "Featured products",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductList" },
              },
            },
          },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Catalogue"],
        summary: "List product categories",
        responses: {
          "200": {
            description: "Available categories",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "string" } },
                example: ["men's clothing", "jewelery", "electronics"],
              },
            },
          },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
    },
    "/products/category/{category}": {
      get: {
        tags: ["Catalogue"],
        summary: "List products in a category",
        description:
          "Returns all category products ordered by rating descending.",
        parameters: [
          {
            name: "category",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "electronics",
          },
        ],
        responses: {
          "200": {
            description: "Category products",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductList" },
              },
            },
          },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
    },
    "/products/search": {
      get: {
        tags: ["Catalogue"],
        summary: "Search products",
        description:
          "Case-insensitive matching across title, description, and category.",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 1 },
            example: "cotton",
          },
        ],
        responses: {
          "200": {
            description: "Matching products",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductList" },
              },
            },
          },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Catalogue"],
        summary: "Get a product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Product details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
    },
    "/enquiries": {
      post: {
        tags: ["Enquiries"],
        summary: "Submit a product enquiry",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Enquiry" },
            },
          },
        },
        responses: {
          "202": {
            description: "Enquiry accepted for delivery",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: {
                  message: "Thank you. Our sales team will be in touch soon.",
                },
              },
            },
          },
          "400": {
            description: "Invalid enquiry details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "502": { description: "Email delivery failed" },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        required: [
          "id",
          "title",
          "price",
          "description",
          "category",
          "image",
          "rating",
        ],
        properties: {
          id: { type: "integer", example: 1 },
          title: {
            type: "string",
            example: "Fjallraven Foldsack No. 1 Backpack",
          },
          price: { type: "number", format: "double", example: 109.95 },
          description: { type: "string" },
          category: { type: "string", example: "men's clothing" },
          image: { type: "string", format: "uri" },
          rating: { $ref: "#/components/schemas/Rating" },
        },
      },
      ProductList: {
        type: "array",
        items: { $ref: "#/components/schemas/Product" },
      },
      Rating: {
        type: "object",
        required: ["rate", "count"],
        properties: {
          rate: { type: "number", minimum: 0, maximum: 5, example: 4.7 },
          count: { type: "integer", minimum: 0, example: 500 },
        },
      },
      Enquiry: {
        type: "object",
        required: ["productId", "name", "email", "message"],
        properties: {
          productId: { type: "integer", minimum: 1, example: 1 },
          name: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            example: "Alex Smith",
          },
          email: {
            type: "string",
            format: "email",
            example: "alex@example.com",
          },
          message: {
            type: "string",
            minLength: 10,
            maxLength: 2000,
            example: "Please tell me more about this product.",
          },
        },
      },
      Message: {
        type: "object",
        required: ["message"],
        properties: { message: { type: "string" } },
      },
      ValidationError: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
          fields: {
            type: "object",
            additionalProperties: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Message" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Message" },
          },
        },
      },
      ServiceUnavailable: {
        description: "Catalogue source is unavailable",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Message" },
          },
        },
      },
    },
  },
} as const;
