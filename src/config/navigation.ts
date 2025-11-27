/**
 * Navigation configuration
 *
 * This file re-exports from the navigation module for backward compatibility.
 * New code should import from '@/config/navigation' directly.
 */

export {
  NAV_LINKS,
  NAV_DROPDOWNS,
  navigationConfig,
  getEnabledNavLinks,
  getEnabledDropdowns,
  getDropdownById,
} from './navigation/index';

export type {
  NavLink,
  NavDropdown,
  NavDropdownItem,
  NavigationConfig,
} from './navigation/index';