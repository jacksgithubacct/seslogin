/**
 * @generated SignedSource<<9beba1b7e898348c600e44df28c90f8d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SettingsDeletePasskeyMutation$variables = {
  id: string;
};
export type SettingsDeletePasskeyMutation$data = {
  readonly deletePasskey: boolean;
};
export type SettingsDeletePasskeyMutation = {
  response: SettingsDeletePasskeyMutation$data;
  variables: SettingsDeletePasskeyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "deletePasskey",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsDeletePasskeyMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsDeletePasskeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "103f8c5429589c21f10ab2dda33437e4",
    "id": null,
    "metadata": {},
    "name": "SettingsDeletePasskeyMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsDeletePasskeyMutation(\n  $id: String!\n) {\n  deletePasskey(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "d8587f6140377af665c8b80dae0ef86e";

export default node;
