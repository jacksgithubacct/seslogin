/**
 * @generated SignedSource<<0006cec5b965b714e4ff37d120257436>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CategoryNewQuery$variables = Record<PropertyKey, never>;
export type CategoryNewQuery$data = {
  readonly nitcGroups: ReadonlyArray<{
    readonly id: string;
    readonly nitcType: string;
  }>;
  readonly ses_participant_types: ReadonlyArray<string>;
};
export type CategoryNewQuery = {
  response: CategoryNewQuery$data;
  variables: CategoryNewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "NitcGroup",
    "kind": "LinkedField",
    "name": "nitcGroups",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "nitcType",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "ses_participant_types",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CategoryNewQuery",
    "selections": (v0/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CategoryNewQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7b8efb397000547dfcc41630e2a4088a",
    "id": null,
    "metadata": {},
    "name": "CategoryNewQuery",
    "operationKind": "query",
    "text": "query CategoryNewQuery {\n  nitcGroups {\n    id\n    nitcType\n  }\n  ses_participant_types\n}\n"
  }
};
})();

(node as any).hash = "921ea49914953b1037edba123ac044d0";

export default node;
