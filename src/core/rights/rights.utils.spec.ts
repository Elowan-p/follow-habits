import { RightsUtils } from './rights.utils';
import { USER_READ, USER_UPDATE, HABITS_CREATE } from './rights.constants';

describe('RightsUtils', () => {
  describe('add', () => {
    it('should add a permission to the mask', () => {
      let mask = 0n;
      mask = RightsUtils.add(mask, USER_READ);
      expect(mask).toBe(USER_READ);
      
      mask = RightsUtils.add(mask, USER_UPDATE);
      expect(mask).toBe(USER_READ | USER_UPDATE);
    });

    it('should not change mask if permission already exists', () => {
      let mask = USER_READ;
      mask = RightsUtils.add(mask, USER_READ);
      expect(mask).toBe(USER_READ);
    });
  });

  describe('remove', () => {
    it('should remove a permission from the mask', () => {
      let mask = USER_READ | USER_UPDATE;
      mask = RightsUtils.remove(mask, USER_UPDATE);
      expect(mask).toBe(USER_READ);
    });

    it('should not change mask if permission does not exist', () => {
      let mask = USER_READ;
      mask = RightsUtils.remove(mask, USER_UPDATE);
      expect(mask).toBe(USER_READ);
    });
  });

  describe('has', () => {
    it('should return true if mask has the permission', () => {
      const mask = USER_READ | HABITS_CREATE;
      expect(RightsUtils.has(mask, USER_READ)).toBe(true);
      expect(RightsUtils.has(mask, HABITS_CREATE)).toBe(true);
    });

    it('should return false if mask does not have the permission', () => {
      const mask = USER_READ;
      expect(RightsUtils.has(mask, HABITS_CREATE)).toBe(false);
    });
  });

  describe('hasAll', () => {
    it('should return true if mask has all specified permissions', () => {
      const mask = USER_READ | USER_UPDATE | HABITS_CREATE;
      const required = USER_READ | HABITS_CREATE;
      expect(RightsUtils.hasAll(mask, required)).toBe(true);
    });

    it('should return false if mask is missing any of the permissions', () => {
      const mask = USER_READ | USER_UPDATE;
      const required = USER_READ | HABITS_CREATE;
      expect(RightsUtils.hasAll(mask, required)).toBe(false);
    });
  });
});
