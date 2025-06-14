import { gql } from '@apollo/client';

export const GET_LATEST_PRODUCTS = gql`
  query GetLatestProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_LATEST_POSTS = gql`
  query GetLatestPosts($first: Int!) {
    posts(first: $first) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      description
      slug
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($first: Int!) {
    productCategories(first: $first) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const GET_PARENT_CATEGORIES = gql`
  query GetParentCategories($first: Int!) {
    productCategories(first: $first, where: { parent: null }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($slug: ID!, $first: Int!, $after: String) {
    productCategory(id: $slug, idType: SLUG) {
      id
      name
      slug
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          slug
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
          }
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $first: Int!) {
    products(where: { search: $search }, first: $first) {
      nodes {
        id
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int!) {
    products(first: $first, where: { featured: true }, orderby: { field: ID, order: DESC }) {
      nodes {
        id
        name
        slug
        image {
          sourceUrl
          altText
        }
        price
        regularPrice
        salePrice
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_TOP_CATEGORIES = gql`
  query GetTopCategories {
    productCategories(first: 4) {
      nodes {
        id
        name
        slug
        products(first: 5, where: { featured: true }, orderby: { field: ID, order: DESC }) {
          nodes {
            id
            name
            slug
            image {
              sourceUrl
              altText
            }
            price
            regularPrice
            salePrice
          }
        }
      }
    }
  }
`; 