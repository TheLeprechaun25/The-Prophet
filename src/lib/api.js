import Arweave from 'arweave';

export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

export const buildQuery = () => {
  const queryObject = { query: `
    query {
        transactions(first: 100, 
          tags: [
            { name: "App-Name", values: ["PublicSquare"] },
            { name: "Content-Type", values: ["text/plain"] }
          ]
      ) {
        edges {
          node {
            id
            owner {
              address
            }
            data {
              size
            }
            block {
              height
              timestamp
            }
            tags {
              name
              value
            }
          }
        }
      }
    }
  `}
	return queryObject
}