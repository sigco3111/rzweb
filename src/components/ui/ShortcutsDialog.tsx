import { Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea, Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { Keyboard } from 'lucide-react';

export function ShortcutsDialog() {
  const { shortcutsDialogOpen, setShortcutsDialogOpen } = useUIStore();

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: '명령 팔레트 열기' },
    { keys: ['Ctrl', 'D'], description: '디스어셈블리 뷰로 전환' },
    { keys: ['Ctrl', 'G'], description: '그래프 뷰로 전환' },
    { keys: ['Ctrl', 'H'], description: '헥스 뷰로 전환' },
    { keys: ['Ctrl', 'S'], description: '문자열 뷰로 전환' },
    { keys: ['Ctrl', 'T'], description: '터미널로 전환' },
    { keys: ['Ctrl', 'B'], description: '사이드바 토글' },
    { keys: ['Ctrl', ','], description: '설정 열기' },
    { keys: ['Ctrl', '/'], description: '키보드 단축키' },
    { keys: ['Esc'], description: '대화상자 닫기 / 취소' },
  ];

  return (
    <Dialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            키보드 단축키
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] mt-4">
          <div className="space-y-1">
            {shortcuts.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 px-2">
                <span className="text-sm font-medium">{s.description}</span>
                <div className="flex gap-1">
                  {s.keys.map((k, j) => (
                    <kbd key={j} className="h-6 min-w-[24px] flex items-center justify-center px-1.5 rounded border border-border bg-muted text-[10px] font-mono shadow-sm">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShortcutsDialogOpen(false)}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
