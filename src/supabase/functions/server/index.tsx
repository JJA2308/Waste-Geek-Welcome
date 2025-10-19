import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b97cbce7/health", (c) => {
  return c.json({ status: "ok" });
});

// Waitlist signup endpoint
app.post("/make-server-b97cbce7/waitlist", async (c) => {
  try {
    const body = await c.req.json();
    const { email, userType } = body;

    // Validate input
    if (!email || !userType) {
      return c.json({ error: "Email and userType are required" }, 400);
    }

    if (!['customer', 'hauler', 'broker'].includes(userType)) {
      return c.json({ error: "Invalid userType. Must be customer, hauler, or broker" }, 400);
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ error: "Invalid email address" }, 400);
    }

    // Store in KV store with a composite key
    const key = `waitlist:${userType}:${email}`;
    const timestamp = new Date().toISOString();
    
    await kv.set(key, {
      email,
      userType,
      timestamp,
    });

    console.log(`Waitlist signup: ${email} as ${userType} at ${timestamp}`);

    return c.json({ 
      success: true, 
      message: "Successfully added to waitlist",
      data: { email, userType, timestamp }
    });
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return c.json({ error: "Failed to add to waitlist", details: String(error) }, 500);
  }
});

// Get all waitlist entries endpoint
app.get("/make-server-b97cbce7/waitlist", async (c) => {
  try {
    // Get all entries with the waitlist prefix
    const entries = await kv.getByPrefix("waitlist:");
    
    console.log(`Retrieved ${entries?.length || 0} waitlist entries`);

    // Group by user type
    const customers = entries?.filter(e => e.userType === 'customer') || [];
    const haulers = entries?.filter(e => e.userType === 'hauler') || [];
    const brokers = entries?.filter(e => e.userType === 'broker') || [];

    return c.json({
      success: true,
      data: {
        all: entries || [],
        customers,
        haulers,
        brokers,
        total: entries?.length || 0,
      }
    });
  } catch (error) {
    console.error("Error retrieving waitlist entries:", error);
    return c.json({ error: "Failed to retrieve waitlist entries", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);