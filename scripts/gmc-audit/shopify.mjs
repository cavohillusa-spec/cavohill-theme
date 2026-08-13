/**
 * Dunne wrapper om de Shopify Admin GraphQL API.
 *
 * Token komt uit de omgeving (.env of shell), nooit uit een bestand in de repo
 * en nooit uit een commit. Zie README.md in deze map.
 */

const API_VERSION = '2026-07';

export function readEnv() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) {
    throw new Error(
      'SHOPIFY_STORE_DOMAIN en SHOPIFY_ADMIN_TOKEN moeten gezet zijn.\n' +
        'Bijvoorbeeld:  export SHOPIFY_STORE_DOMAIN=xxx.myshopify.com\n' +
        '               export SHOPIFY_ADMIN_TOKEN=shpat_...\n' +
        'Zet ze niet in een bestand dat gecommit wordt.'
    );
  }
  return { domain, token };
}

export async function gql(query, variables = {}) {
  const { domain, token } = readEnv();
  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors) {
    const msg = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL-fout: ${msg}`);
  }
  return json.data;
}

/** Haalt alles op wat de audit nodig heeft, in zo min mogelijk requests. */
export async function fetchStoreState() {
  const shop = await gql(`{
    shop {
      name email contactEmail currencyCode taxesIncluded shipsToCountries
      shopAddress { address1 address2 city provinceCode zip country company phone }
      primaryDomain { host sslEnabled }
      shopPolicies { type title body }
    }
    onlineStore { passwordProtection { enabled } }
  }`);

  const catalog = await gql(`{
    productsCount { count }
    products(first: 50) {
      nodes {
        title status handle tracksInventory
        options { name values }
        variants(first: 5) { nodes { sku barcode compareAtPrice inventoryPolicy } }
      }
    }
    collections(first: 100) { nodes { title handle productsCount { count } } }
    pages(first: 50) { nodes { title handle isPublished body } }
    menus(first: 20) { nodes { title handle items { title url } } }
    themes(first: 20) { nodes { id name role } }
  }`);

  const shipping = await gql(`{
    deliveryProfiles(first: 5) {
      nodes {
        name
        profileLocationGroups {
          locationGroupZones(first: 30) {
            nodes {
              zone { name countries { name code { countryCode } } }
              methodDefinitions(first: 10) {
                nodes {
                  name active
                  rateProvider { ... on DeliveryRateDefinition { price { amount currencyCode } } }
                }
              }
            }
          }
        }
      }
    }
  }`);

  return { ...shop, ...catalog, ...shipping };
}
