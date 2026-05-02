Stage 1
Problem Statement

The goal of this application is to display campus notifications such as events, results, and placement updates by fetching data from an external API. Since not all notifications are equally important, we need a way to prioritize them so that the most relevant ones appear at the top.

The idea is to build a “Priority Inbox” that shows the most important unread notifications first. Along with this, the system should log all major frontend actions (like fetching data, calculating priority, rendering UI, and user interactions) to a remote logging service instead of using console logs.

Priority Algorithm Explanation

To prioritize notifications, each item is assigned a score based on two factors: its type and how recent it is.

Each notification type is given a weight:

Placement → highest priority
Result → medium priority
Event → lowest priority

This weight is multiplied by 1000 to create a clear gap between different types. Then, a small recency factor is added so that newer notifications are ranked higher within the same type.

Formula:

Score = typeWeight * 1000 + recencyDecay

Where:

recencyDecay = 1 / (currentTime - notificationTime + 1)

This ensures that even an older placement notification will still rank above a newer event, but among placements, the latest ones will come first.

Type Weight Table
Notification Type	Weight	Base Score
Placement	3	3000
Result	2	2000
Event	1	1000
Top-N Maintenance Efficiency

To display only the most relevant notifications, the system follows these steps:

Filter out only unread notifications
Calculate the score for each of them
Sort them in descending order
Select the top N notifications

The time complexity is mainly dominated by sorting, which is O(U log U) where U is the number of unread notifications. This is efficient enough for typical frontend use.

If the dataset becomes large, a min-heap of size N can be used to optimize it further to O(U log N).

Data Flow Diagram
API Server → Fetcher → State Management → UI → Priority Logic → UI
                         ↓
                   Logging Service

The application fetches data from the API, stores it in state, processes it using the priority logic, and then renders it in the UI. At every step, important actions are logged to a remote logging service.

Logging Strategy
Event	Level	Source	Description
Auto-poll triggered	info	hook	Triggered when polling starts
Fetch start/end	info	hook	Tracks API request lifecycle
Fetch error	error	hook	Logged when API fails
Scoring start	info	utils	Priority calculation begins
Unread count	info	utils	Number of unread notifications
Top-N selected	info	utils	Final shortlisted notifications
API request	info	api	Call made to notifications API
PriorityInbox render	debug	page	Page rendering
NotificationCard render	debug	component	Individual notification render
Mark as read clicked	info	state	User interaction
Summary

This approach ensures that important notifications are always visible, newer updates are prioritized, and the system remains efficient. At the same time, logging helps in tracking system behavior and debugging without relying on console outputs.