# Queueing Theory Calculator 

Desktop application designed to calculate, analyze, and optimize waiting line systems (Queueing Theory) in Academic environments. Built with **React**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, and packaged with **Electron**.

![alt text](image.png)

## Features ✨

*   **Multi-language Support:** Native, reload-free translation in both English and Spanish.
*   **Built-in Queueing Models:**
    *   `PICS` (M/M/1): Infinite Population, 1 Server.
    *   `PICM` (M/M/k): Infinite Population, k Servers.
    *   `PFCS` (M/M/1/M/M): Finite Population, 1 Server.
    *   `PFCM` (M/M/k/M/M): Finite Population, k Servers.
*   **Economic Analysis:** Determines total economic cost (CT) based on waiting time penalties in the queue, the system, service time, and server maintenance constraints. Fully automated overlapping metrics exclusion to maintain mathematical precision.
*   **Robust Math Engine:** Iterative calculus, deadlock prevention when lambda exceeds system limits, and real-time reactive metrics (W, Wq, L, Lq, Pn, P0).
*   **Data Visualization:** Integrated optimization charts (Recharts) plotting Cost vs Number of Servers (`k`) and Service Rate (`μ`) to aid fast decision making.

## Getting Started 

### Install Dependencies

```bash
npm install
```

### Development Environment (Hot-Reload)

```bash
npm run dev
```

### Build for Production

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For GNU/Linux
npm run build:linux
```
