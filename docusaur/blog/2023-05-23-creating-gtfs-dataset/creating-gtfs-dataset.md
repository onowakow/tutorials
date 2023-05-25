---
slug: creating-gtfs-dataset
# title: Deploy Docusaurus to Static Web App
authors: [nowakowski]
tags: [GTFS, transit, Python, Jupyter Notebook, Data Engineering]
---

# Creating a GTFS Dataset

When I'm not developing software, I'm driving buses for University of Wyoming. I've been interested in the General Transit Feed Specification (GTFS), which is the spec used for displaying transit data on Google Maps.

This post will document how I went from route timetables to a complete GTFS dataset.

## Cleaning the Timetables

I received timetables from the transit department stop names and departure times. I needed to create a standard CSV format that would be easy to load and work with using Python.

The raw timetables I received from the department are full of different formatting and cell merges. Below is a screenshot of part of the timetable.

![Raw timetable as provided by the department. Cells are variously shaded and merged.](./media/raw-timetables.png)

Furthermore, I needed to substitute stop names with stop IDs that I define in `stops.csv`. As we will see later, GTFS is organized much like a SQL database, and the **Stop Times** table includes foreign keys to reference stops from the **Stops** table. The provided timetables used named stops, so I substituted the stop names with stop IDs. The stop IDs will be defined when we create stops.csv.

Here are the standardized route timetable rules:

1. Cell **A1** holds the **route_id** as defined in `routes.csv`

2. In **Row 2**, each column corresponds to a stop, and holds the **stop_id**

3. From **Row 3** onwards, each column holds a stop time, and each row is considered a trip. **Note**: A trip is defined as a continuous ride that a passenger could hypothetically take. There may not be _drop-off only_ stops in the middle of a trip.

4. Beyond these rules, there are specific formatting requirements as defined in the next section.

### Formatting Requirements

- Times will be stored as plain text in the HH:MM:SS format. This means that times must be in 24hr and have trailing 0s when single-digit. Ex. `06:35:00` and `18:30:00`.

- Stop requests are signified with a trailing `!` like `06:35:00!`.

- Interpolated leave times are signified with a trailing `?` like `06:35:00?`

- Drop-off only is signified with a trailing `|` (pipe) like `06:35:00|`

- A stop may have multiple special attributes

### Managing These Files

I am storing these files in a Google Drive folder that can be easily downloaded and inserted into the Python program. This makes Google Drive the single point of truth, while any data files stored in the local program may be deleted without issue.
