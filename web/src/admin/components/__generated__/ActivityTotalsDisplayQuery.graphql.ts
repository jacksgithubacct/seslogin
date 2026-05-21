/**
 * @generated SignedSource<<448469834ddc6b2d036f26f4b02d204f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ActivityTotalsDisplayQuery$variables = {
  endTime: number;
  location: string;
  startTime: number;
};
export type ActivityTotalsDisplayQuery$data = {
  readonly location: {
    readonly id: string;
    readonly periodSummaryByCategory: ReadonlyArray<{
      readonly category: {
        readonly id: string;
        readonly name: string;
      };
      readonly totalTime: number;
    }>;
    readonly periodSummaryByMember: ReadonlyArray<{
      readonly person: {
        readonly firstName: string;
        readonly id: string;
        readonly lastName: string;
      };
      readonly totalTime: number;
    }>;
  };
};
export type ActivityTotalsDisplayQuery = {
  response: ActivityTotalsDisplayQuery$data;
  variables: ActivityTotalsDisplayQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTime"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "endTime",
    "variableName": "endTime"
  },
  {
    "kind": "Variable",
    "name": "startTime",
    "variableName": "startTime"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalTime",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "location"
      }
    ],
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "location",
    "plural": false,
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "MemberPeriodSummary",
        "kind": "LinkedField",
        "name": "periodSummaryByMember",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
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
              }
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "CategoryPeriodSummary",
        "kind": "LinkedField",
        "name": "periodSummaryByCategory",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Category",
            "kind": "LinkedField",
            "name": "category",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v5/*: any*/)
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
    "name": "ActivityTotalsDisplayQuery",
    "selections": (v6/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ActivityTotalsDisplayQuery",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "4f0551c848eaad8cf242b0ba142aeedc",
    "id": null,
    "metadata": {},
    "name": "ActivityTotalsDisplayQuery",
    "operationKind": "query",
    "text": "query ActivityTotalsDisplayQuery(\n  $location: ID!\n  $startTime: Int!\n  $endTime: Int!\n) {\n  location(id: $location) {\n    id\n    periodSummaryByMember(startTime: $startTime, endTime: $endTime) {\n      person {\n        id\n        firstName\n        lastName\n      }\n      totalTime\n    }\n    periodSummaryByCategory(startTime: $startTime, endTime: $endTime) {\n      category {\n        id\n        name\n      }\n      totalTime\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2094824a7aaf25db6e3f3488c822a31c";

export default node;
