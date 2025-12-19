import { useMemo } from 'react';

// VISIONARY KEYWORDS
const VISIONARY_KEYWORDS = [
    'dream', 'lucid', 'weird', 'glitch', 'sync', 'pattern', 'saw', 'felt', 'deja vu',
    'matrix', 'signal', 'frequency', 'vision', 'archon', 'awakening', 'reality', 'shift'
];

export function useBioMetrics(journal = [], streakMs = 0) {
    return useMemo(() => {
        // === 1. D2 RECEPTOR STATUS (DOPAMINE) ===
        // Logic: Avg word count of last 3 entries
        const last3Entries = journal.slice(0, 3);
        let avgWordCount = 0;

        if (last3Entries.length > 0) {
            const totalWords = last3Entries.reduce((acc, note) => {
                return acc + (note.content ? note.content.trim().split(/\s+/).length : 0);
            }, 0);
            avgWordCount = totalWords / last3Entries.length;
        }

        let dopamineStatus = { label: 'ZOMBIE MODE', percent: 10, color: 'text-gray-500' };
        if (avgWordCount > 50) {
            dopamineStatus = { label: 'HYPER-SENSITIVE', percent: 100, color: 'text-[#00ff00]' };
        } else if (avgWordCount > 20) {
            dopamineStatus = { label: 'HEALING', percent: 60, color: 'text-yellow-500' };
        } else if (avgWordCount > 0) {
            dopamineStatus = { label: 'FRIED', percent: 30, color: 'text-red-500' };
        }

        // === 2. PINEAL GLAND CALCIFICATION ===
        // Logic: Keywords in the LATEST entry (for immediate feedback)
        const latestEntry = journal[0];
        let pinealStatus = { label: 'CALCIFIED', percent: 5, color: 'text-gray-500' };

        if (latestEntry) {
            const text = latestEntry.content.toLowerCase();
            const matches = VISIONARY_KEYWORDS.filter(word => text.includes(word));

            if (matches.length >= 3) {
                pinealStatus = { label: 'THIRD EYE OPEN', percent: 100, color: 'text-[#00ff00] animate-pulse' };
            } else if (matches.length >= 1) {
                pinealStatus = { label: 'DECALCIFYING', percent: 50, color: 'text-yellow-500' };
            }
        }

        // === 3. VIBRATION FREQUENCY (Hz) ===
        // Logic: Base 50 + (Streak Days * 10) + Morning Bonus - Witching Hour Penalty
        const streakDays = Math.floor(streakMs / (1000 * 60 * 60 * 24));
        let frequency = 50 + (streakDays * 10);
        let isUnstable = false;

        if (latestEntry) {
            const date = new Date(latestEntry.id); // Using the ID as timestamp
            const hour = date.getHours();

            // Morning Ritual Bonus (5AM - 8AM)
            if (hour >= 5 && hour < 8) {
                frequency += 500;
            }
            // Witching Hour Penalty (2AM - 4AM)
            else if (hour >= 2 && hour < 4) {
                frequency -= 20; // Drop
                isUnstable = true;
            }
        }
        // Cap min freq
        if (frequency < 0) frequency = 0;

        // === 4. THREAT LEVEL ===
        /*
          Low: No entries in 24h (Radio Silence).
          Medium: 1 entry/day (Standard).
          High: Multiple entries within a short window (Burst Transmission).
          Bonus: 2-4AM entries boost threat.
        */
        let threatLevel = { label: 'LOW - SILENT', color: 'text-gray-500', note: 'NO RECENT TRANSMISSIONS' };

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        // Check for silence
        if (journal.length === 0 || (now - journal[0].id > oneDay)) {
            threatLevel = { label: 'LOW - SILENT', color: 'text-gray-500', note: 'RADIO SILENCE OBSERVED' };
        } else {
            // Standard assumption
            threatLevel = { label: 'MEDIUM - ACTIVE', color: 'text-yellow-500', note: 'STANDARD TRAFFIC DETECTED' };

            // Check for Burst Transmission (3 notes in < 1 hour)
            if (journal.length >= 3) {
                const timeGap = journal[0].id - journal[2].id;
                const oneHour = 60 * 60 * 1000;
                if (timeGap < oneHour) {
                    threatLevel = { label: 'CRITICAL - BURST', color: 'text-red-500 animate-pulse', note: 'HIGH VELOCITY DATA DUMP' };
                }
            }

            // Witching Hour Override (Latest note is 2-4am)
            const latestHour = new Date(journal[0].id).getHours();
            if (latestHour >= 2 && latestHour < 4) {
                threatLevel = { label: 'ELEVATED - ANOMALY', color: 'text-red-500', note: 'WITCHING HOUR ACTIVITY' };
            }
        }

        return {
            dopamine: dopamineStatus,
            pineal: pinealStatus,
            frequency: { value: frequency, isUnstable },
            threat: threatLevel
        };

    }, [journal, streakMs]);
}
