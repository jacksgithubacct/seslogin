/**
 * @generated SignedSource<<0fca99e83010b2ad7e6139d56206f756>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SettingsMutation$variables = {
  dailyLocationIds: ReadonlyArray<string>;
};
export type SettingsMutation$data = {
  readonly updateMyEmailConfig: {
    readonly emailSummaryLocationIds: ReadonlyArray<string>;
    readonly id: string;
  };
};
export type SettingsMutation = {
  response: SettingsMutation$data;
  variables: SettingsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "dailyLocationIds"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "dailyLocationIds",
        "variableName": "dailyLocationIds"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "updateMyEmailConfig",
    "plural": false,
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
        "name": "emailSummaryLocationIds",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e6cad6b000b5bd87f268b4857e36ec34",
    "id": null,
    "metadata": {},
    "name": "SettingsMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsMutation(\n  $dailyLocationIds: [String!]!\n) {\n  updateMyEmailConfig(dailyLocationIds: $dailyLocationIds) {\n    id\n    emailSummaryLocationIds\n  }\n}\n"
  }
};
})();

(node as any).hash = "38286a67b930356cf3d575518fb59db6";

export default node;
