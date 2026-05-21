import { Link } from "react-router";
import { graphql, useFragment, useLazyLoadQuery } from "react-relay";
import type { UserListQuery } from "./__generated__/UserListQuery.graphql";
import type { UserList_user$key } from "./__generated__/UserList_user.graphql";
import { formatTimeDiff } from "../../lib/time";
import { useUserInfo } from "../components/useUserInfo";

function Row(props: { user: UserList_user$key; idx: number; isDev: boolean }) {
  const isDev = props.isDev;
  const user = useFragment<UserList_user$key>(
    graphql`
      fragment UserList_user on User {
        id
        email
        accessTime
        isSuper
        locations {
          id
          name
        }
        deleted
      }
    `,
    props.user,
  );

  return (
    <tr className={props.idx % 2 === 0 ? "odd" : "even"}>
      {isDev && (
        <td style={{ fontFamily: "monospace", fontSize: "0.85em" }}>
          {user.id}
        </td>
      )}
      <td>{user.email}</td>
      <td>
        {user.accessTime
          ? formatTimeDiff(new Date(user.accessTime * 1000), new Date()) +
            " ago"
          : "-"}
      </td>
      <td>{user.isSuper ? "Yes" : "No"}</td>
      <td>
        {user.isSuper ? null : user.locations.map((l) => l.name).join(", ")}
      </td>
      <td className="options">
        <Link to={`/admin/users/${user.id}`}>Edit</Link>&nbsp;
        {/* NYI on backend
        <button
          className="delete"
          onClick={deleteUser}
          disabled={isMutationInFlight}
        >
          Delete
        </button> */}
      </td>
    </tr>
  );
}

export default function UserList() {
  const { isDev } = useUserInfo();
  const data = useLazyLoadQuery<UserListQuery>(
    graphql`
      query UserListQuery {
        users {
          id
          accessTime
          ...UserList_user
        }
      }
    `,
    {},
  );

  const users = [...(data?.users || [])].sort((a, b) => {
    const aAccessTime = a.accessTime ?? -Infinity;
    const bAccessTime = b.accessTime ?? -Infinity;
    return bAccessTime - aAccessTime;
  });

  return (
    <>
      <table className="admin">
        <thead>
          <tr>
            {isDev && <th>ID</th>}
            <th>Email</th>
            <th>Last Access</th>
            <th>Super</th>
            <th>Locations</th>
            <th style={{ width: 100 }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <Row key={user.id} user={user} idx={idx} isDev={isDev} />
          ))}
        </tbody>
      </table>
    </>
  );
}
