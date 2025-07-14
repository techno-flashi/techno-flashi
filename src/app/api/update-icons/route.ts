import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { findBestIcon } from '@/lib/ai-tool-icons';

export async function POST(request: NextRequest) {
  try {
    const { action, toolId } = await request.json();

    if (action === 'update-all') {
      return await updateAllTools();
    } else if (action === 'update-single' && toolId) {
      return await updateSingleTool(toolId);
    } else if (action === 'stats') {
      return await getStats();
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateAllTools() {
  try {
    // جلب جميع أدوات الذكاء الاصطناعي
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch tools', details: error },
        { status: 500 }
      );
    }

    if (!tools || tools.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tools found to update',
        updated: 0,
        errors: 0
      });
    }

    let updatedCount = 0;
    let errorCount = 0;
    const results = [];

    // تحديث كل أداة
    for (const tool of tools) {
      try {
        // العثور على أفضل أيقونة للأداة
        const bestIcon = findBestIcon(tool.name, tool.description || '', tool.category || '');
        
        // تحديث الأداة في قاعدة البيانات
        const { error: updateError } = await supabase
          .from('ai_tools')
          .update({
            logo_url: bestIcon.iconUrl
          })
          .eq('id', tool.id);

        if (updateError) {
          errorCount++;
          results.push({
            tool: tool.name,
            status: 'error',
            error: updateError.message
          });
        } else {
          updatedCount++;
          results.push({
            tool: tool.name,
            status: 'success',
            icon: bestIcon.name,
            iconUrl: bestIcon.iconUrl
          });
        }

        // توقف قصير لتجنب الضغط على قاعدة البيانات
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (toolError) {
        errorCount++;
        results.push({
          tool: tool.name,
          status: 'error',
          error: toolError instanceof Error ? toolError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} tools successfully`,
      updated: updatedCount,
      errors: errorCount,
      total: tools.length,
      results: results
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update tools', details: error },
      { status: 500 }
    );
  }
}

async function updateSingleTool(toolId: string) {
  try {
    // جلب الأداة
    const { data: tool, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('id', toolId)
      .single();

    if (error || !tool) {
      return NextResponse.json(
        { error: 'Tool not found', details: error },
        { status: 404 }
      );
    }

    // العثور على أفضل أيقونة
    const bestIcon = findBestIcon(tool.name, tool.description || '', tool.category || '');

    // تحديث الأداة
    const { error: updateError } = await supabase
      .from('ai_tools')
      .update({
        logo_url: bestIcon.iconUrl
      })
      .eq('id', toolId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update tool', details: updateError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated tool: ${tool.name}`,
      tool: tool.name,
      icon: bestIcon.name,
      iconUrl: bestIcon.iconUrl
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update single tool', details: error },
      { status: 500 }
    );
  }
}

async function getStats() {
  try {
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('name, category, logo_url')
      .order('category');

    if (error || !tools) {
      return NextResponse.json(
        { error: 'Failed to fetch stats', details: error },
        { status: 500 }
      );
    }

    // تجميع حسب الفئة
    const categories = tools.reduce((acc: any, tool) => {
      const category = tool.category || 'غير محدد';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // عدد الأدوات التي لها أيقونات من SVG Repo
    const withSvgIcons = tools.filter(tool => 
      tool.logo_url && tool.logo_url.includes('svgrepo.com')
    ).length;

    return NextResponse.json({
      success: true,
      stats: {
        total: tools.length,
        withSvgIcons: withSvgIcons,
        needsUpdate: tools.length - withSvgIcons,
        categories: categories
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get stats', details: error },
      { status: 500 }
    );
  }
}

// GET endpoint للإحصائيات السريعة
export async function GET() {
  return await getStats();
}
