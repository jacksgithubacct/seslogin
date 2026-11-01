---
title: Who's here
summary: Seeing who's signed in, and signing out someone who forgot.
order: 60
---

Your kiosk may show **Currently signed in**: everyone signed in at the unit, and
how long they've been here. Depending on how your unit set the kiosk up, it's
always on the screen beside the SES ID box, or behind a button.

![The Currently signed in list, with a Sign out button for each member](../screenshots/kiosk-whos-here.png "Who's here, with Sign out buttons.")

## Signing out someone who forgot

If your unit has turned it on, each person in the list has a **Sign out** button.
It helps the last person out make sure nobody is left signed in.

1. Check they've really left.
2. Press **Sign out** next to their name.
3. Choose what they did and check the times, just as if they were signing
   themselves out, then press **Submit**.

The kiosk never signs anyone out without those steps, so a person always confirms
the times.

## If it says it couldn't sign someone out

Now and then a red message appears, such as **could not sign out Alice Anderson:
Already signed out**. Nothing has been changed, and there are no steps to redo.

- **Already signed out**, or **That sign-in no longer exists**: they've already
  been signed out, or the entry was removed, so the list was a little out of date.
  It catches up by itself.
- **network issue while starting the sign-out**: the kiosk couldn't reach the
  server. Check the connection and press **Sign out** again.
- **the server's answer was incomplete**: press **Sign out** again. If it keeps
  happening, tell your unit's SESLogin administrator.
