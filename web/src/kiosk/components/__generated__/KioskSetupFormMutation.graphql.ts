/**
 * @generated SignedSource<<f540d6bbf70684275b09b29eb058a6c1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type KioskSetupFormMutation$variables = {
  code: string;
};
export type KioskSetupFormMutation$data = {
  readonly authSession: string | null | undefined;
};
export type KioskSetupFormMutation = {
  response: KioskSetupFormMutation$data;
  variables: KioskSetupFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "code"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "code",
        "variableName": "code"
      }
    ],
    "kind": "ScalarField",
    "name": "authSession",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "KioskSetupFormMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "KioskSetupFormMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "20904625e0d22575ba985d394c66b73a",
    "id": null,
    "metadata": {},
    "name": "KioskSetupFormMutation",
    "operationKind": "mutation",
    "text": "mutation KioskSetupFormMutation(\n  $code: String!\n) {\n  authSession(code: $code)\n}\n"
  }
};
})();

(node as any).hash = "ae99a083dcfdf58e6781a5fe5dce03f9";

export default node;
