import { Dialog, DialogContent, DialogHeader, DialogTitle, Tabs, TabsList, TabsTrigger, TabsContent, ScrollArea, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
import { useFileStore, useUIStore, useSettingsStore } from '@/stores';
import { useTheme } from '@/providers';
import { Settings, Monitor, Terminal, Database, Sliders, Moon, Sun, Laptop, Trash2 } from 'lucide-react';
import { clearAnalysisCache, computeFileHash, getCacheStats, removeCachedAnalysis, type CacheStats } from '@/lib/rizin';
import { useState, useEffect } from 'react';

const ANALYSIS_LEVELS = [
  { value: 'aa', label: '기본 (aa)', description: '빠른 분석, 기본 함수 탐지' },
  { value: 'aaa', label: '전체 (aaa)', description: '추천 - xref 포함 전체 분석' },
  { value: 'aaaa', label: '심층 (aaaa)', description: '실험적 - 재귀 분석' },
];

export function SettingsDialog() {
  const { settingsDialogOpen, setSettingsDialogOpen } = useUIStore();
  const { currentFile } = useFileStore();
  const { 
    terminalFontSize, setTerminalFontSize, 
    terminalScrollback, setTerminalScrollback,
    terminalAutocompleteMinChars, setTerminalAutocompleteMinChars,
    terminalAutocompleteMaxResults, setTerminalAutocompleteMaxResults,
    ioCache, setIoCache,
    analysisDepth, setAnalysisDepth,
    maxOutputSizeMb, setMaxOutputSizeMb,
    noAnalysis, setNoAnalysis,
    showLineNumbers, setShowLineNumbers
  } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [clearingCurrentCache, setClearingCurrentCache] = useState(false);

  useEffect(() => {
    if (settingsDialogOpen) {
      getCacheStats().then(setCacheStats);
    }
  }, [settingsDialogOpen]);

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogContent className="flex h-[min(92vh,640px)] w-[calc(100vw-1rem)] max-w-3xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border p-4 sm:p-6">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            설정
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <Tabs defaultValue="general" className="flex h-full w-full flex-col md:flex-row">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-muted/30 p-2 md:h-full md:w-52 md:flex-col md:items-stretch md:justify-start md:overflow-visible md:border-b-0 md:border-r md:p-2">
              <TabsTrigger value="general" className="h-9 shrink-0 justify-start gap-2">
                <Monitor className="h-4 w-4" /> 일반
              </TabsTrigger>
              <TabsTrigger value="terminal" className="h-9 shrink-0 justify-start gap-2">
                <Terminal className="h-4 w-4" /> 터미널
              </TabsTrigger>
              <TabsTrigger value="analysis" className="h-9 shrink-0 justify-start gap-2">
                <Sliders className="h-4 w-4" /> 분석
              </TabsTrigger>
              <TabsTrigger value="io" className="h-9 shrink-0 justify-start gap-2">
                <Database className="h-4 w-4" /> I/O 및 저장소
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-6 p-4 sm:p-6">
                  <TabsContent value="general" className="m-0 space-y-4">
                    <section>
                      <h4 className="text-sm font-semibold mb-3">테마</h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Button
                          variant={theme === 'light' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('light')}
                          className="w-full"
                        >
                          <Sun className="h-4 w-4 mr-2" /> 라이트
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('dark')}
                          className="w-full"
                        >
                          <Moon className="h-4 w-4 mr-2" /> 다크
                        </Button>
                        <Button
                          variant={theme === 'system' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('system')}
                          className="w-full"
                        >
                          <Laptop className="h-4 w-4 mr-2" /> 시스템
                        </Button>
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="terminal" className="m-0 space-y-4">
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">글꼴 크기</label>
                        <Select value={terminalFontSize.toString()} onValueChange={(v) => setTerminalFontSize(parseInt(v))}>
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[10, 11, 12, 14, 16, 18].map(s => (
                              <SelectItem key={s} value={s.toString()}>{s}px</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">스크롤백 줄 수</label>
                        <Select value={terminalScrollback.toString()} onValueChange={(v) => setTerminalScrollback(parseInt(v))}>
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1000, 5000, 10000, 50000].map(s => (
                              <SelectItem key={s} value={s.toString()}>{s.toLocaleString()}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">자동완성 최소 글자 수</label>
                          <p className="text-[10px] text-muted-foreground">
                            이 글자 수 이상 입력하면 실시간 제안이 표시됩니다. Tab 키로 더 빨리 완성을 요청할 수 있습니다.
                          </p>
                        </div>
                        <Select value={terminalAutocompleteMinChars.toString()} onValueChange={(v) => setTerminalAutocompleteMinChars(parseInt(v))}>
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 8, 10].map(value => (
                              <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">최대 결과 수</label>
                          <p className="text-[10px] text-muted-foreground">
                            터미널 자동완성 목록을 제한합니다. 입력한 내용과 일치하는 항목이 더 적으면 더 적은 결과가 표시됩니다.
                          </p>
                        </div>
                        <Select value={terminalAutocompleteMaxResults.toString()} onValueChange={(v) => setTerminalAutocompleteMaxResults(parseInt(v))}>
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 8, 12, 16, 20, 30, 50, 100].map(value => (
                              <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="analysis" className="m-0 space-y-4">
                    <section className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">분석 수준</label>
                        <Select value={analysisDepth.toString()} onValueChange={(v) => setAnalysisDepth(parseInt(v))}>
                          <SelectTrigger className="w-full h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ANALYSIS_LEVELS.map((level, i) => (
                              <SelectItem key={level.value} value={(i + 1).toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{level.label}</span>
                                  <span className="text-xs text-muted-foreground">{level.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-2">
                          분석은 바이너리를 열 때 실행됩니다. 수준이 높을수록 시간이 더 걸리지만 더 많은 함수를 탐지합니다.
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">최대 명령 출력</label>
                        <Select value={maxOutputSizeMb.toString()} onValueChange={(v) => setMaxOutputSizeMb(parseInt(v))}>
                          <SelectTrigger className="w-full h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[4, 8, 16, 32, 64].map(size => (
                              <SelectItem key={size} value={size.toString()}>
                                {size} MB
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-2">
                          값이 클수록 큰 바이너리와 긴 목록에 더 많은 출력을 유지하지만 브라우저 메모리를 더 사용합니다.
                        </p>
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="io" className="m-0 space-y-4">
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">I/O 캐시 활성화</label>
                          <p className="text-[10px] text-muted-foreground">
                            파일 읽기를 메모리에 캐시합니다.
                          </p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={ioCache} 
                          onChange={(e) => setIoCache(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">자동 분석 건너뛰기</label>
                          <p className="text-[10px] text-muted-foreground">
                            분석 없이 바이너리를 엽니다.
                          </p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={noAnalysis} 
                          onChange={(e) => setNoAnalysis(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">줄 번호 표시</label>
                          <p className="text-[10px] text-muted-foreground">
                            디스어셈블리 뷰에 주소 열을 표시합니다.
                          </p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={showLineNumbers} 
                          onChange={(e) => setShowLineNumbers(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">분석 캐시</label>
                            <p className="text-[10px] text-muted-foreground">
                              {cacheStats ? `${cacheStats.entryCount} 캐시됨 ${cacheStats.entryCount === 1 ? '바이너리' : '바이너리'} (${(cacheStats.totalBytes / 1024 / 1024).toFixed(1)} MB)` : '로딩 중...'}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            {currentFile && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={clearingCurrentCache}
                                onClick={async () => {
                                  setClearingCurrentCache(true);
                                  try {
                                    const hash = await computeFileHash(currentFile.data);
                                    await removeCachedAnalysis(hash);
                                    setCacheStats(await getCacheStats());
                                  } finally {
                                    setClearingCurrentCache(false);
                                  }
                                }}
                              >
                                현재 바이너리 캐시 삭제
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-destructive hover:text-destructive"
                              onClick={async () => {
                                await clearAnalysisCache();
                                setCacheStats({ entryCount: 0, totalBytes: 0, entries: [] });
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> 전체 삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        <div className="shrink-0 border-t border-border bg-muted/30 p-4 flex justify-end">
          <Button onClick={() => setSettingsDialogOpen(false)}>완료</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
