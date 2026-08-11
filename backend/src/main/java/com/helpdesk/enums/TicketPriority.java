package com.helpdesk.enums;

public enum TicketPriority {

    LOW(24 * 60),
    MEDIUM(8 * 60),
    HIGH(2 * 60),
    CRITICAL(30);

    private final int slaMinutes;

    TicketPriority(int slaMinutes) {
        this.slaMinutes = slaMinutes;
    }

    public int getSlaMinutes() {
        return slaMinutes;
    }
}
