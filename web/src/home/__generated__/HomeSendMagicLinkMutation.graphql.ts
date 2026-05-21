/**
 * @generated SignedSource<<3a2c015e8b10282c82fb100757574531>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HomeSendMagicLinkMutation$variables = {
  email: string;
};
export type HomeSendMagicLinkMutation$data = {
  readonly sendMagicLink: boolean;
};
export type HomeSendMagicLinkMutation = {
  response: HomeSendMagicLinkMutation$data;
  variables: HomeSendMagicLinkMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
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
      }
    ],
    "kind": "ScalarField",
    "name": "sendMagicLink",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HomeSendMagicLinkMutation",
    "selections": (v1/*: any*/),
    "type": "MutationRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HomeSendMagicLinkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "10e3075bb564d01d167a8c36d03efbae",
    "id": null,
    "metadata": {},
    "name": "HomeSendMagicLinkMutation",
    "operationKind": "mutation",
    "text": "mutation HomeSendMagicLinkMutation(\n  $email: String!\n) {\n  sendMagicLink(email: $email)\n}\n"
  }
};
})();

(node as any).hash = "df400c87426b76a697c6d004be820245";

export default node;
