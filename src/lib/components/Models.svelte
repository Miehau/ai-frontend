<script lang="ts">
    import { browser } from "$app/environment";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { invoke } from "@tauri-apps/api/tauri";
    import type { Selected } from "bits-ui";
    import { slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import ApiKeyInput from "./ApiKeyInput.svelte";
    import { onMount } from "svelte";
    import { Switch } from "$lib/components/ui/switch";
    import type { Model } from "$lib/types/models";
    import { Trash2 } from "lucide-svelte";

    let models: Model[] = [];

    // Define the options for the Select component
    const providers = [
        { value: "openai", label: "OpenAI" },
        { value: "anthropic", label: "Anthropic" },
        { value: "azure", label: "Azure" },
    ] as const;

    let selectedProvider = providers[0];
    let modelName = "";
    let deploymentName = "";
    let deploymentUrl = "";

    async function loadModels() {
        try {
            models = await invoke<Model[]>("get_models");
        } catch (error) {
            console.error("Failed to load models:", error);
        }
    }

    onMount(() => {
        loadModels();
    });

    $: formData = {
        provider: selectedProvider.value,
        model_name: modelName,
        // Include Azure-specific fields conditionally
        ...(selectedProvider.value === "azure" && {
            deployment_name: deploymentName,
            url: deploymentUrl
        })
    };

    let isSubmitting = false;

    async function handleSubmit(event: Event) {
        event.preventDefault();
        isSubmitting = true;

        try {
            console.log(formData);
            await invoke<string>("add_model", {model: formData});
            await loadModels();
            
            // Reset form
            modelName = "";
            deploymentName = "";
            deploymentUrl = "";
            selectedProvider = providers[0];
        } catch (error: any) {
            console.error(error);
        } finally {
            isSubmitting = false;
        }
    }
    function handleFormModelUpdate(v: Selected<{ value: string; label: string }> | undefined) {
        if (v) {
            selectedProvider = providers.find(p => p.value === v.value) || providers[0];
        }
    }

    async function toggleModel(model: Model) {
        try {
            await invoke("toggle_model", { model: { 
                provider: model.provider, 
                model_name: model.model_name 
            }});
            await loadModels();  // Refresh the list
        } catch (error) {
            console.error("Failed to toggle model:", error);
        }
    }

    async function deleteModel(model: Model) {
        try {
            await invoke("delete_model", { model: model });
            await loadModels();  // Refresh the list
        } catch (error) {
            console.error("Failed to delete model:", error);
        }
    }
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Add New Model</Card.Title>
    </Card.Header>
    <Card.Content>
        <form on:submit={handleSubmit} class="space-y-6">
            <div class="space-y-1.5">
                <div class="flex items-center space-x-2">
                    <label for="name" class="font-medium w-24">Name:</label>
                    <Input id="name" bind:value={modelName} />
                </div>
                <p class="text-sm text-muted-foreground">
                    Model name, e.g. gpt-4
                </p>
            </div>

            <div class="space-y-1.5">
                <div class="flex items-center space-x-2">
                    <label for="provider" class="font-medium w-24">Provider</label>
                    <Select.Root 
                    selected={selectedProvider}
                    onSelectedChange={handleFormModelUpdate}>
                        <Select.Trigger class="w-full">
                            <Select.Value placeholder="Select provider" />
                        </Select.Trigger>
                        <Select.Content>
                            {#each providers as provider}
                                <Select.Item value={provider}>
                                    {provider.label}
                                </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            {#if selectedProvider.value === "azure"}
                <div transition:slide={{ duration: 300, easing: cubicOut }}>
                    <div class="space-y-1.5">
                        <div class="flex items-center space-x-2">
                            <label for="deploymentName" class="font-medium w-24">Deployment Name:</label>
                            <Input id="deploymentName" bind:value={deploymentName} />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex items-center space-x-2">
                            <label for="deploymentUrl" class="font-medium w-24">Deployment URL:</label>
                            <Input id="deploymentUrl" bind:value={deploymentUrl} />
                        </div>
                    </div>
                </div>
            {/if}
        </form>
    </Card.Content>
    <Card.Footer class="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting} on:click={handleSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
    </Card.Footer>
</Card.Root>

<Card.Root class="mt-6">
    <Card.Header>
        <Card.Title>Configured Models</Card.Title>
    </Card.Header>
    <Card.Content>
        {#if models.length === 0}
            <p class="text-muted-foreground">No models configured yet.</p>
        {:else}
            <div class="space-y-2">
                {#each models as model}
                    <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div class="flex items-center gap-2">
                            <h4 class="font-medium">{model.model_name}</h4>
                            <span class="text-sm text-muted-foreground">•</span>
                            <span class="text-sm text-muted-foreground">{model.provider}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Switch 
                                checked={model.enabled} 
                                onCheckedChange={() => toggleModel(model)}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                class="text-destructive hover:text-destructive/90"
                                on:click={() => deleteModel(model)}
                                aria-label={`Delete model ${model.model_name}`}
                            >
                                <Trash2 class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </Card.Content>
</Card.Root>

<Card.Root class="mt-6">
    <Card.Header>
        <Card.Title>API Keys</Card.Title>
    </Card.Header>
    <Card.Content>
        {#each providers as provider}
            <ApiKeyInput {provider} />
        {/each}
    </Card.Content>
</Card.Root>
