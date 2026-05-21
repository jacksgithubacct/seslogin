/**
 * @generated SignedSource<<48a07259bf68e6a044523b27d11e0ec0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type NitcExportStatus = "PENDING" | "SYNCED" | "%future added value";
export type ActivityListMemberLoadMoreQuery$variables = {
  after?: string | null | undefined;
  first: number;
  person: string;
};
export type ActivityListMemberLoadMoreQuery$data = {
  readonly person: {
    readonly firstName: string;
    readonly id: string;
    readonly lastName: string;
    readonly periods: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: {
            readonly id: string;
            readonly name: string;
          } | null | undefined;
          readonly endTime: number | null | undefined;
          readonly id: string;
          readonly location: {
            readonly id: string;
            readonly name: string;
          };
          readonly nitcExportStatus: NitcExportStatus | null | undefined;
          readonly startTime: number;
        };
      }>;
      readonly pageInfo: {
        readonly endCursor: string | null | undefined;
        readonly hasNextPage: boolean;
      };
    };
  };
};
export type ActivityListMemberLoadMoreQuery = {
  response: ActivityListMemberLoadMoreQuery$data;
  variables: ActivityListMemberLoadMoreQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "person"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "person"
      }
    ],
    "concreteType": "Person",
    "kind": "LinkedField",
    "name": "person",
    "plural": false,
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "after",
            "variableName": "after"
          },
          {
            "kind": "Variable",
            "name": "first",
            "variableName": "first"
          }
        ],
        "concreteType": "PeriodConnection",
        "kind": "LinkedField",
        "name": "periods",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PeriodEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Period",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startTime",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endTime",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nitcExportStatus",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Category",
                    "kind": "LinkedField",
                    "name": "category",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ActivityListMemberLoadMoreQuery",
    "selections": (v5/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ActivityListMemberLoadMoreQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "745bc3ecb9a7b6d770a4888ed37f7d78",
    "id": null,
    "metadata": {},
    "name": "ActivityListMemberLoadMoreQuery",
    "operationKind": "query",
    "text": "query ActivityListMemberLoadMoreQuery(\n  $person: ID!\n  $first: Int!\n  $after: String\n) {\n  person(id: $person) {\n    id\n    firstName\n    lastName\n    periods(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          startTime\n          endTime\n          nitcExportStatus\n          category {\n            id\n            name\n          }\n          location {\n            id\n            name\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f1569fe327cfcde648ebf59eba9de735";

export default node;
