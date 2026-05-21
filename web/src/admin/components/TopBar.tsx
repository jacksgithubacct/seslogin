interface TopBarProps {
  username: string;
}

export default function TopBar({ username }: TopBarProps) {
  return (
    <div id="top_bar">
      <div className="left">
        <a href="/">SES Activity</a>
      </div>
      <div className="right">
        <span className="username">{username}</span>
      </div>
      <div className="clear"></div>
    </div>
  );
}
