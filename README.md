# India EXIM Bank Exam Notes - Operating Systems Master Portal

A fast, mobile-friendly study portal and application designed for B.Tech CSE graduates and beginners appearing for the Export-Import Bank of India (India EXIM Bank) Specialist Officer (IT) examination.

## Quick Start
- Open in Browser: Simply double-click index.html to open the notes application in Chrome, Edge, Safari, or Firefox.
- Run as Local Web Server:
  ```powershell
  python -m http.server 8080
  ```
  Then open http://localhost:8080 in your browser.

## Core Features & Design
1. iOS App Flat Design System:
   - Clean, shadow-free interface with 1px hairline borders and iOS SF typography.
   - Distinct, accessible color themes for each of the 8 study units.
   - Mobile-first responsive layout with iOS-style bottom tab bar for one-thumb navigation.
2. Complete 8 Banking-Focused Units (Beginner-Friendly Simple English):
   - Unit 1: OS Architecture, Kernel Modes & Enterprise Banking OS Stacks (RHEL, AIX, IBM z/OS)
   - Unit 2: Process Management, Threads & Concurrency (SBI YONO threads, Process States)
   - Unit 3: CPU Scheduling in Banking Servers (Convoy Effect, Round Robin, Time Quantum)
   - Unit 4: Process Synchronization & Deadlocks (Coffman Conditions, Global Lock Ordering)
   - Unit 5: Memory Management & Virtual Memory (Paging, TLB Cache, Linux HugePages 2MB, Thrashing)
   - Unit 6: Storage, File Systems & RAID (Inodes, ext4/XFS Journaling, RAID 10 vs RAID 6)
   - Unit 7: Virtualization, Containers & High Availability (Type-1 Hypervisors vs Containers, STONITH)
   - Unit 8: Linux Administration, Diagnostic Commands & RBI Compliance (top, vmstat, iostat, RBI 4 Pillars)
3. Learning Elements (Inspired by Computer Science Tutorials):
   - High-Resolution PNG Architecture Diagrams for every unit (tap to enlarge modal).
   - Code Snippet Blocks with dark editor styling and one-click copy.
   - Formatted Output Boxes with monospace terminal results.
   - Pro Tip Boxes with green accent borders for key insights.
   - Interactive Knowledge Check Quizzes with instant answer evaluation and accordion reveal.
4. Interactive Exam Tools:
   - High-Yield Mode for rapid revision of formulas and pro tips.
   - Real-Time Keyword Search across all units and case studies.
   - Study Progress Tracker with persistent localStorage saving.
   - Print & PDF Export Stylesheet.
