<script lang="ts">
  import { Label, Input, Modal, Button } from 'flowbite-svelte';
  import { SignIn } from '$lib';
  import MetaTag from '../utils/MetaTag.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  let form = (data as any).form ?? {};

  let title = 'Sign in to platform';
  let site = {
    name: 'Flowbite',
    img: '/images/flowbite-svelte-icon-logo.svg',
    link: '/',
    imgAlt: 'FlowBite Logo'
  };

  let rememberMe = true;
  let lostPassword = true;
  let createAccount = true;
  let lostPasswordLink = 'forgot-password';
  let loginTitle = 'Login to your account';
  let registerLink = '/';
  let createAccountTitle = 'Create account';
  const path: string = '/sign-in';
  const description: string = 'Sign in example - Flowbite Svelte Admin Dashboard';
  const metaTitle: string = 'Flowbite Svelte Admin Dashboard - Sign in';
  const subtitle: string = 'Sign in';
  let showError = Boolean(form?.message);
</script>

<MetaTag {path} {description} title={metaTitle} {subtitle} />

<SignIn {title} {site} {rememberMe} {lostPassword} {createAccount} {lostPasswordLink} {loginTitle} {registerLink} {createAccountTitle}>
  <div>
    <Label for="email" class="mb-2 dark:text-white">Your email</Label>
    <input
      name="emailOrPhone"
      type="text"
      required
      placeholder="Enter your email or phone number"
      title="Please enter a valid email or phone number"
      class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
  <div>
    <Label for="password" class="mb-2 dark:text-white">Your password</Label>
    <Input type="password" name="password" id="password" placeholder="••••••••" required class="border outline-none dark:border-gray-600 dark:bg-gray-700" />
  </div>
  {#if showError && form?.message}
    <Modal bind:open={showError} size="md" class="[&_.modal]:bg-white dark:[&_.modal]:bg-gray-800">
      {#snippet header()}
        <div class="text-base font-semibold text-gray-900 dark:text-white">Error</div>
      {/snippet}
      <div class="rounded border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-200">
        <div class="text-sm leading-6">
          {form.message}
        </div>
      </div>
      {#snippet footer()}
        <div class="flex justify-end gap-2">
          <Button color="alternative" onclick={() => (showError = false)}>Okay</Button>
        </div>
      {/snippet}
    </Modal>
  {/if}
</SignIn>
