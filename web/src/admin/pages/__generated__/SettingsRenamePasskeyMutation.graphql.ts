/**
 * @generated SignedSource<<cda9e494ac5467e4a8072937d89707c4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SettingsRenamePasskeyMutation$variables = {
  id: string;
  name: string;
};
export type SettingsRenamePasskeyMutation$data = {
  readonly renamePasskey: {
    readonly id: string;
    readonly name: string;
  };
};
export type SettingsRenamePasskeyMutation = {
  response: SettingsRenamePasskeyMutation$data;
  variables: SettingsRenamePasskeyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
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
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "PasskeyInfo",
    "kind": "LinkedField",
    "name": "renamePasskey",
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
        "name": "name",
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
    "name": "SettingsRenamePasskeyMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsRenamePasskeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "913258fac78fc544ef1a2092520e19a1",
    "id": null,
    "metadata": {},
    "name": "SettingsRenamePasskeyMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsRenamePasskeyMutation(\n  $id: String!\n  $name: String!\n) {\n  renamePasskey(id: $id, name: $name) {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "d755cf2eb0ff9e47efa2a6544d3b1c76";

export default node;
