/**
 * @generated SignedSource<<b70d78afd509b5472a305270219cb196>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ActivityBreakdownDisplayQuery$variables = {
  endTime: number;
  location: string;
  startTime: number;
};
export type ActivityBreakdownDisplayQuery$data = {
  readonly location: {
    readonly id: string;
    readonly periodSummaryByCategoryByMember: ReadonlyArray<{
      readonly category: {
        readonly id: string;
        readonly name: string;
      };
      readonly members: ReadonlyArray<{
        readonly person: {
          readonly firstName: string;
          readonly id: string;
          readonly lastName: string;
        };
        readonly totalTime: number;
      }>;
      readonly totalTime: number;
    }>;
    readonly periodSummaryByMemberByCategory: ReadonlyArray<{
      readonly categories: ReadonlyArray<{
        readonly category: {
          readonly id: string;
          readonly name: string;
        };
        readonly totalTime: number;
      }>;
      readonly person: {
        readonly firstName: string;
        readonly id: string;
        readonly lastName: string;
      };
      readonly totalTime: number;
    }>;
  };
};
export type ActivityBreakdownDisplayQuery = {
  response: ActivityBreakdownDisplayQuery$data;
  variables: ActivityBreakdownDisplayQuery$variables;
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalTime",
  "storageKey": null
},
v7 = {
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
v8 = [
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
        "concreteType": "MemberCategoryPeriodSummary",
        "kind": "LinkedField",
        "name": "periodSummaryByMemberByCategory",
        "plural": true,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "CategoryPeriodSummary",
            "kind": "LinkedField",
            "name": "categories",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "CategoryMemberPeriodSummary",
        "kind": "LinkedField",
        "name": "periodSummaryByCategoryByMember",
        "plural": true,
        "selections": [
          (v7/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "MemberPeriodSummary",
            "kind": "LinkedField",
            "name": "members",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/)
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
    "name": "ActivityBreakdownDisplayQuery",
    "selections": (v8/*: any*/),
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
    "name": "ActivityBreakdownDisplayQuery",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "5b3fc39a4b345b55e26508513589ae07",
    "id": null,
    "metadata": {},
    "name": "ActivityBreakdownDisplayQuery",
    "operationKind": "query",
    "text": "query ActivityBreakdownDisplayQuery(\n  $location: ID!\n  $startTime: Int!\n  $endTime: Int!\n) {\n  location(id: $location) {\n    id\n    periodSummaryByMemberByCategory(startTime: $startTime, endTime: $endTime) {\n      person {\n        id\n        firstName\n        lastName\n      }\n      totalTime\n      categories {\n        category {\n          id\n          name\n        }\n        totalTime\n      }\n    }\n    periodSummaryByCategoryByMember(startTime: $startTime, endTime: $endTime) {\n      category {\n        id\n        name\n      }\n      totalTime\n      members {\n        person {\n          id\n          firstName\n          lastName\n        }\n        totalTime\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5637fb3247a974f6b66cd9f6f69f688a";

export default node;
