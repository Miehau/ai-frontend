<script lang="ts">
  import Triangle from "lucide-svelte/icons/triangle";
  import Bot from "lucide-svelte/icons/bot";
  import SquareTerminal from "lucide-svelte/icons/square-terminal";
  import CodeXML from "lucide-svelte/icons/code-xml";
  import Settings2 from "lucide-svelte/icons/settings-2";
  import LifeBuoy from "lucide-svelte/icons/life-buoy";
  import Book from "lucide-svelte/icons/book";
  import SquareUser from "lucide-svelte/icons/square-user";
  import Users from "lucide-svelte/icons/users";
  import History from "lucide-svelte/icons/history";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { page } from "$app/stores";
  import ConversationDrawer from "$lib/components/conversation/ConversationDrawer.svelte";

  $: currentPath = $page.url.pathname;
  
  let isConversationDrawerOpen = false;
  
  function toggleConversationDrawer() {
    isConversationDrawerOpen = !isConversationDrawerOpen;
  }
</script>

<aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
  <div class="border-b p-2">
    <Button variant="outline" size="icon" aria-label="Home">
      <Triangle class="size-5 fill-foreground" />
    </Button>
  </div>
  <nav class="grid gap-1 p-2">
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <a href="/">
          <Button
            variant="ghost"
            size="icon"
            class="rounded-lg {currentPath === '/' ? 'bg-muted' : ''}"
            aria-label="Playground"
            builders={[builder]}
          >
            <SquareTerminal class="size-5" />
          </Button>
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Playground</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <a href="/models">
          <Button
            variant="ghost"
            size="icon"
            class="rounded-lg {currentPath === '/models' ? 'bg-muted' : ''}"
            aria-label="Models"
            builders={[builder]}
          >
            <CodeXML class="size-5" />
          </Button>
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>API</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <a href="/assistants">
          <Button
            variant="ghost"
            size="icon"
            class="rounded-lg {currentPath === '/assistants' ? 'bg-muted' : ''}"
            aria-label="Assistants"
            builders={[builder]}
          >
            <Users class="size-5" />
          </Button>
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Assistants</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-lg {isConversationDrawerOpen ? 'bg-muted' : ''}"
          aria-label="Conversation History"
          builders={[builder]}
          on:click={toggleConversationDrawer}
        >
          <History class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Conversation History</Tooltip.Content>
    </Tooltip.Root>
  </nav>
  <nav class="mt-auto grid gap-1 p-2">
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="mt-auto rounded-lg"
          aria-label="Help"
          builders={[builder]}
        >
          <LifeBuoy class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Help</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>

<ConversationDrawer bind:isOpen={isConversationDrawerOpen} />
