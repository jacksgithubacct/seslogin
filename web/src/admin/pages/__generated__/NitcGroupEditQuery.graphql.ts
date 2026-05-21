/**
 * @generated SignedSource<<00f05dd9d2a87e5dbb9d0e1c38386db6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type NitcGroupEditQuery$variables = {
  id: string;
};
export type NitcGroupEditQuery$data = {
  readonly nitcGroup: {
    readonly id: string;
    readonly nitcType: string;
    readonly sesTags: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
  };
  readonly ses_nonincident_tags: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }>;
  readonly ses_nonincident_types: ReadonlyArray<string>;
};
export type NitcGroupEditQuery = {
  response: NitcGroupEditQuery$data;
  variables: NitcGroupEditQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "NitcGroup",
    "kind": "LinkedField",
    "name": "nitcGroup",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "nitcType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SesNonIncidentTag",
        "kind": "LinkedField",
        "name": "sesTags",
        "plural": true,
        "selections": (v2/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "ses_nonincident_types",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "SesNonIncidentTag",
    "kind": "LinkedField",
    "name": "ses_nonincident_tags",
    "plural": true,
    "selections": (v2/*: any*/),
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NitcGroupEditQuery",
    "selections": (v3/*: any*/),
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NitcGroupEditQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "99d4ad8fcdb14f97baaa235cc2f813c9",
    "id": null,
    "metadata": {},
    "name": "NitcGroupEditQuery",
    "operationKind": "query",
    "text": "query NitcGroupEditQuery(\n  $id: ID!\n) {\n  nitcGroup(id: $id) {\n    id\n    nitcType\n    sesTags {\n      id\n      name\n    }\n  }\n  ses_nonincident_types\n  ses_nonincident_tags {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "8ed10953c3827f6c8e8f4635a01636ae";

export default node;
