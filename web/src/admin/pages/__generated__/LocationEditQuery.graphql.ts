/**
 * @generated SignedSource<<b530efff062b8f2985540b4d19fd74c2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LocationEditQuery$variables = {
  id: string;
};
export type LocationEditQuery$data = {
  readonly location: {
    readonly enabled: boolean;
    readonly id: string;
    readonly name: string;
    readonly nitcEnabled: number | null | undefined;
  };
};
export type LocationEditQuery = {
  response: LocationEditQuery$data;
  variables: LocationEditQuery$variables;
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
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "location",
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "enabled",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "nitcEnabled",
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
    "name": "LocationEditQuery",
    "selections": (v1/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationEditQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d8474176f6cb8dd463207e59da472e44",
    "id": null,
    "metadata": {},
    "name": "LocationEditQuery",
    "operationKind": "query",
    "text": "query LocationEditQuery(\n  $id: ID!\n) {\n  location(id: $id) {\n    id\n    name\n    enabled\n    nitcEnabled\n  }\n}\n"
  }
};
})();

(node as any).hash = "03ac8efb742dbf778d80e2057ee8f057";

export default node;
