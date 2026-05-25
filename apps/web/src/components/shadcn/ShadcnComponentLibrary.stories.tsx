import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, BookOpen, Check, ChevronDown, Database, MoreHorizontal, Search, Settings } from 'lucide-react';
import { expect } from 'storybook/test';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from './ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const meta = {
  title: 'Design System/shadcn UI',
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <main className="storybook-canvas storybook-canvas--wide">
          <div className="mx-auto grid w-full max-w-6xl gap-6 font-[var(--font-ui)]">
            <Story />
          </div>
        </main>
      </TooltipProvider>
    )
  ]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FoundationControls: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>shadcn 基础控件</CardTitle>
        <CardDescription>Button、Badge、Input、Select、Switch、Checkbox 使用官方 registry 组件源码。</CardDescription>
        <CardAction>
          <Badge variant="secondary">registry</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <Button>
            <Search />
            搜索组件
          </Button>
          <Button variant="secondary">同步组件库</Button>
          <Button variant="outline">查看合同</Button>
          <Button size="icon" variant="ghost" aria-label="更多操作">
            <MoreHorizontal />
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input aria-label="组件名称" placeholder="输入组件名称" />
          <Select defaultValue="stable">
            <SelectTrigger aria-label="组件状态">
              <SelectValue placeholder="组件状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="forming">Forming</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked aria-label="启用 Storybook 识别" />
            启用 Storybook 识别
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked aria-label="只使用成熟组件" />
            只使用成熟组件
          </label>
        </div>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('shadcn 基础控件')).toBeVisible();
    await expect(canvas.getByRole('button', { name: '搜索组件' })).toBeVisible();
    await expect(canvas.getByRole('combobox', { name: '组件状态' })).toBeVisible();
  }
};

export const OverlayPatterns: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Overlay patterns</CardTitle>
        <CardDescription>Dialog、Sheet、Popover、Dropdown、Tooltip 都来自 Radix/shadcn 组合。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>打开 Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>组件迁移确认</DialogTitle>
              <DialogDescription>弹层必须带标题和描述，后续页面迁移直接复用这个模式。</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">取消</Button>
              <Button>确认</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">打开 Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Reader side panel</SheetTitle>
              <SheetDescription>Sheet 可作为后续 Reader/Inspector 抽屉迁移参考。</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Bell />
              状态提示
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <p className="text-sm text-muted-foreground">Popover 用于轻量上下文，不替代长期 Drawer。</p>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              更多
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings />
                打开设置
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Database />
                检查数据源
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" aria-label="阅读系统">
              <BookOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>阅读系统</TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  )
};

export const DataDisplayAndNavigation: Story = {
  render: () => (
    <Tabs defaultValue="inventory">
      <TabsList>
        <TabsTrigger value="inventory">组件清单</TabsTrigger>
        <TabsTrigger value="states">状态</TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <Card>
          <CardHeader>
            <CardTitle>Storybook inventory</CardTitle>
            <CardDescription>表格、分隔线和状态 badge 组成可扫描的组件库视图。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ['Button', 'shadcn/ui', 'Ready'],
                  ['Dialog', 'Radix primitive', 'Ready'],
                  ['Command', 'cmdk', 'Ready']
                ].map(([name, source, status]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>{source}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="states">
        <Card>
          <CardHeader>
            <CardTitle>Loading and feedback</CardTitle>
            <CardDescription>Skeleton、Alert、Textarea 作为后台和编辑流的基础形态。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Alert>
              <Check />
              <AlertTitle>shadcn registry 已接入</AlertTitle>
              <AlertDescription>后续页面优先组合成熟组件，再补 MyBlog runtime glue。</AlertDescription>
            </Alert>
            <Separator />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Textarea placeholder="组件迁移备注" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('tab', { name: '组件清单' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('tab', { name: '状态' }));
    await expect(canvas.getByText('Loading and feedback')).toBeVisible();
  }
};

export const CommandSurface: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Command surface</CardTitle>
        <CardDescription>cmdk + shadcn command 作为后续全局命令面板的成熟组合参考。</CardDescription>
      </CardHeader>
      <CardContent>
        <Command className="rounded-lg border shadow-sm">
          <CommandInput placeholder="搜索 MyBlog 组件..." />
          <CommandList>
            <CommandEmpty>没有结果</CommandEmpty>
            <CommandGroup heading="Runtime">
              <CommandItem>
                <Search />
                <span>Open command palette</span>
                <CommandShortcut>Cmd+K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <BookOpen />
                <span>Open reader drawer</span>
                <CommandShortcut>R</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Command 组件不拥有 runtime truth，只提供可复用交互结构。</p>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('搜索 MyBlog 组件...')).toBeVisible();
    await expect(canvas.getByText('Open command palette')).toBeVisible();
  }
};
