/**
 * @generated SignedSource<<caa1fc63d334ddce8f909ad6470ae440>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HomeLoginMutation$variables = {
  email: string;
  password: string;
};
export type HomeLoginMutation$data = {
  readonly authUser: string | null | undefined;
};
export type HomeLoginMutation = {
  response: HomeLoginMutation$data;
  variables: HomeLoginMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "password"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      }
    ],
    "kind": "ScalarField",
    "name": "authUser",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HomeLoginMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HomeLoginMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "267b78ee4ae9af3da8181b4bdb47717c",
    "id": null,
    "metadata": {},
    "name": "HomeLoginMutation",
    "operationKind": "mutation",
    "text": "mutation HomeLoginMutation(\n  $email: String!\n  $password: String!\n) {\n  authUser(email: $email, password: $password)\n}\n"
  }
};
})();

(node as any).hash = "47a1cde6f0bd2edd250b48e476622235";

export default node;
