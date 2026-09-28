import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const progressFilePath = path.join(process.cwd(), 'src', 'data', 'progress.json');

export async function GET() {
  try {
    const data = await fs.readFile(progressFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading progress:', error);
    return NextResponse.json({}, { status: 200 }); // Return empty object if file doesn't exist
  }
}

export async function POST(request: Request) {
  try {
    const { word, status } = await request.json();

    let progressData: Record<string, string> = {};
    
    try {
      const data = await fs.readFile(progressFilePath, 'utf-8');
      progressData = JSON.parse(data);
    } catch (e) {
      // Ignore if file doesn't exist
    }

    // Update status
    progressData[word] = status;

    // Write back to file
    await fs.writeFile(progressFilePath, JSON.stringify(progressData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, progress: progressData });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
