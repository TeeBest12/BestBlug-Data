import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Plan from "@/models/Plan";

// In-memory fallback database for AI Studio environment
const fallbackPlans = [
  {
    _id: "mock-1",
    network: "MTN",
    plan: "1.0 GB (SME)",
    price: "250",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-2",
    network: "MTN",
    plan: "2.0 GB (SME)",
    price: "500",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-3",
    network: "MTN",
    plan: "5.0 GB (SME)",
    price: "1250",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-4",
    network: "Airtel",
    plan: "1.5 GB (CG)",
    price: "500",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-5",
    network: "Airtel",
    plan: "5.0 GB (CG)",
    price: "1500",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-6",
    network: "GLO",
    plan: "2.9 GB",
    price: "500",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-7",
    network: "9mobile",
    plan: "1.5 GB",
    price: "500",
    validity: "30 Days",
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

let memoryPlans = [...fallbackPlans];

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(memoryPlans);
    }

    const plans = await Plan.find().sort({
      createdAt: -1,
    });

    // If no plans exist yet in the database, pre-seed them
    if (plans.length === 0) {
      return NextResponse.json(memoryPlans);
    }

    return NextResponse.json(plans);
  } catch (error) {
    console.warn("Using in-memory fallback due to database fetch error:", error.message);
    return NextResponse.json(memoryPlans);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const conn = await connectDB();
    
    if (!conn) {
      const newPlan = {
        _id: "mock-" + Date.now(),
        ...body,
        createdAt: new Date().toISOString()
      };
      memoryPlans.unshift(newPlan);
      return NextResponse.json(newPlan, { status: 201 });
    }

    const plan = await Plan.create(body);
    return NextResponse.json(plan, {
      status: 201,
    });
  } catch (error) {
    console.warn("Using in-memory fallback due to database write error:", error.message);
    try {
      const body = await request.json().catch(() => ({}));
      const newPlan = {
        _id: "mock-" + Date.now(),
        ...body,
        createdAt: new Date().toISOString()
      };
      memoryPlans.unshift(newPlan);
      return NextResponse.json(newPlan, { status: 201 });
    } catch (innerError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
}