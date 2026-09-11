import { expect, type Page } from '@playwright/test';
import { waitForUiAction } from './uiRuntime';

export const openPlanAndWait = async ({ page, planId }: { page: Page; planId: string }): Promise<void> => {
  await page.goto(`/range-use-plan/${planId}`);
  await expect(page.getByTestId('rup-options-button')).toBeVisible();
};

export const saveDraft = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Save Draft' }).click();
  await expect(page.locator('.toast')).toContainText(/successfully saved/i);
};

export const attemptSaveDraft = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Save Draft' }).click();
  await waitForUiAction(page);
};

export const submitPlan = async (page: Page): Promise<void> => {
  await page.getByTestId('rup-submit-button').click();
  await waitForUiAction(page);
};

export const expectValidationToast = async (page: Page, message: string | RegExp): Promise<void> => {
  await expect(page.locator('.toast')).toContainText(message);
};

export const expectValidationMessage = async (page: Page, message: string | RegExp): Promise<void> => {
  await expect(page.locator('body')).toContainText(message);
};

export const addBlankPlantCommunity = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Add Plant Community' }).click();
  await page.getByRole('menuitem').first().click();
  await page.locator('.rup__plant-community__title').last().click();
  await page.locator('textarea[name$=".notes"]').last().fill('E2E plant community description');
};

export const addBlankPlantCommunityAction = async (page: Page): Promise<void> => {
  await page.locator('div[role="button"]').filter({ hasText: 'None' }).last().click();
  await page.getByRole('option', { name: 'Maintain Plant Community' }).click();
  await page.getByRole('button', { name: 'Add Action' }).last().click();
};

export const addBlankIndicatorPlant = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Add Indicator Plant' }).first().click();
};

export const addBlankMonitoringArea = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Add Monitoring Area' }).last().click();
  const dialog = page.getByRole('dialog', { name: 'Monitoring Area Name' });
  await dialog.locator('input[name="input"]').fill('E2E monitoring area');
  await dialog.getByRole('button', { name: 'Submit' }).click();
};

export const addBlankMinisterIssue = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Add Minister Issue' }).click();
  await page.getByRole('menuitem').first().click();
  await page.locator('.rup__missues li').last().click();
  const detailFields = page.locator('textarea[name$=".detail"]');
  const objectiveFields = page.locator('textarea[name$=".objective"]');
  await detailFields.last().fill('E2E minister issue details');
  await objectiveFields.last().fill('E2E minister issue objective');
};

export const addBlankAdditionalRequirement = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Add Requirement' }).click();
};

export const addBlankManagementConsideration = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Add Consideration' }).click();
  await page.getByRole('menuitem').first().click();
};

export const openFirstPasture = async (page: Page): Promise<void> => {
  await page.locator('.rup__pasture').first().click();
};

export const deleteFirstPasture = async (page: Page): Promise<void> => {
  await openFirstPasture(page);
  await page.locator('.rup__pasture svg[data-testid="MoreVertIcon"]').first().click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
};

export const clearFirstHayCuttingTonnes = async (page: Page): Promise<void> => {
  await page.locator('input[name$=".tonnes"]').first().fill('');
};
