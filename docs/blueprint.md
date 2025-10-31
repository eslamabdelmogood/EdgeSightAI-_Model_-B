# **App Name**: EdgeSight Logistics

## Core Features:

- Process oneM2M Alerts: Handle incoming oneM2M messages, extract relevant fields (asset_ID, part_PN, location_coords, estimated_failure_time), and store them in Firestore as new documents within the Critical_Alerts collection. Includes setting the initial status to 'Pending Order' and timestamping the entry.
- Trigger Marketplace Order: Automatically trigger a simulated purchase order to an external Marketplace API when a new critical alert is logged in Firestore with the status 'Pending Order', then update the Firestore document to 'Order Confirmed', logging order confirmation and triggering timestamp.
- Real-time Alert Dashboard: Display real-time updates from the Critical_Alerts collection in Firestore. Show essential fields, and a button for Pending Orders labeled "Confirm Maintenance Request Launch" to trigger the order.
- Maintenance Request Launch: A button allows the user to launch a request. Clicking this button updates the corresponding Firestore document to set the status to Awaiting Confirmation or add a maintenance_triggered field.

## Style Guidelines:

- Primary color: Deep navy blue (#2E3192), representing reliability and technological focus, with a nod to logistics.
- Background color: Light gray (#E0E5EC), providing a clean and modern backdrop.
- Accent color: Bright cyan (#00FFFF), used sparingly to draw attention to interactive elements and key information, complementing the navy blue for a high-tech feel.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern look; well-suited to both headlines and body text.
- Use clear, minimalist icons to represent different asset types and alert statuses. The icons should follow the accent color.
- A clean and intuitive layout should display alerts in a clear, tabular format with real-time updating.
- Subtle animations for status changes to provide immediate visual feedback.