export function logDateToString(dt: Date | string) {
    const isoString = new Date(dt).toISOString();
    const datestring = isoString.replace("T", " ").substring(0, isoString.length - 3);
    return datestring;
}

export function formatOpeningHours(opens: string, closes: string, days: string): string {
    const dayAbbreviations: Record<string, string> = {
        "Monday": "H",
        "Tuesday": "K",
        "Wednesday": "Sze",
        "Thursday": "Cs",
        "Friday": "P",
        "Saturday": "Szo",
        "Sunday": "V"
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const selectedDays = days.split(";").filter(d => d.trim().length > 0);

    if (selectedDays.length === 0) {
        return "";
    }

    // Sort days by their order in the week
    const sortedDays = selectedDays
        .filter(day => daysOfWeek.includes(day))
        .sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));

    if (sortedDays.length === 0) {
        return "";
    }

    // Group consecutive days
    const groups: string[][] = [];
    let currentGroup: string[] = [];

    for (let i = 0; i < sortedDays.length; i++) {
        const currentDay = sortedDays[i];
        const currentIndex = daysOfWeek.indexOf(currentDay);

        if (currentGroup.length === 0) {
            currentGroup.push(dayAbbreviations[currentDay]);
        } else {
            const previousDay = sortedDays[i - 1];
            const previousIndex = daysOfWeek.indexOf(previousDay);

            // If consecutive, add to current group
            if (currentIndex === previousIndex + 1) {
                currentGroup.push(dayAbbreviations[currentDay]);
            } else {
                // Start a new group
                groups.push(currentGroup);
                currentGroup = [dayAbbreviations[currentDay]];
            }
        }
    }

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    // Format each group
    const formattedGroups = groups.map(group => {
        if (group.length === 1) {
            return group[0];
        } else if (group.length === 2) {
            return `${group[0]}-${group[1]}`;
        } else {
            return `${group[0]}-${group[group.length - 1]}`;
        }
    });

    return `${formattedGroups.join(", ")}: ${opens}-${closes}`;
}