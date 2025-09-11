# Company Feature Implementation Tasks

## 📋 Overview
Implementing company name and address fields for both users and customers, with flexible invoice recipient selection.

## 🎯 Goals
- Add optional company information for users
- Add optional company information for customers  
- Enable flexible invoice recipient selection (personal vs company)
- Enhance search functionality to include company names
- Maintain backward compatibility

---

## 📊 Task Breakdown

### Phase 1: Database Models ✅
- [x] **Task 1.1**: Update User Model
  - [x] Add `companyName?: string` field
  - [x] Add `companyAddress?: { street, city, state, zipCode, country }` field
  - [x] Test model changes
  - [ ] **Rollback**: Remove company fields from User model

- [x] **Task 1.2**: Update Customer Model  
  - [x] Add `companyName?: string` field
  - [x] Add `hasCompany?: boolean` field
  - [x] Test model changes
  - [ ] **Rollback**: Remove company fields from Customer model

- [x] **Task 1.3**: Update Invoice Model
  - [x] Add `recipientType?: 'personal' | 'company'` field
  - [x] Add `recipientName?: string` field
  - [x] Add `fromCompany?: boolean` field
  - [x] Test model changes
  - [ ] **Rollback**: Remove recipient fields from Invoice model

### Phase 2: API Routes ✅
- [ ] **Task 2.1**: Update Settings API
  - [ ] Modify `src/app/api/settings/route.ts`
  - [ ] Handle company name and address updates
  - [ ] Test API endpoints
  - [ ] **Rollback**: Revert settings API changes

- [ ] **Task 2.2**: Update Customers API
  - [ ] Modify `src/app/api/customers/route.ts`
  - [ ] Handle company name in CRUD operations
  - [ ] Update search to include company names
  - [ ] Test API endpoints
  - [ ] **Rollback**: Revert customers API changes

- [ ] **Task 2.3**: Update Invoices API
  - [ ] Modify `src/app/api/invoices/route.ts`
  - [ ] Handle recipient selection in invoice creation
  - [ ] Test API endpoints
  - [ ] **Rollback**: Revert invoices API changes

### Phase 3: User Interface - Settings ✅
- [ ] **Task 3.1**: Update Settings Page
  - [ ] Modify `src/app/settings/page.tsx`
  - [ ] Add "Company Information" section
  - [ ] Add company name input field
  - [ ] Add company address fields (street, city, state, zip, country)
  - [ ] Test form submission
  - [ ] **Rollback**: Remove company section from settings

### Phase 4: User Interface - Customer Management ✅
- [ ] **Task 4.1**: Update Customer Creation Page
  - [ ] Modify `src/app/customers/new/page.tsx`
  - [ ] Add "Company Name" field (optional)
  - [ ] Update form validation
  - [ ] Test customer creation
  - [ ] **Rollback**: Remove company field from customer creation

- [ ] **Task 4.2**: Update Customer List Page
  - [ ] Modify `src/app/customers/page.tsx`
  - [ ] Display company names in customer list
  - [ ] Add visual indicators for customers with companies
  - [ ] Test display functionality
  - [ ] **Rollback**: Remove company display from customer list

- [ ] **Task 4.3**: Update Customer Search
  - [ ] Modify customer search components
  - [ ] Include company names in search results
  - [ ] Test search functionality
  - [ ] **Rollback**: Revert search to personal names only

### Phase 5: User Interface - Invoice Management ✅
- [ ] **Task 5.1**: Update Invoice Creation Page
  - [ ] Modify `src/app/invoices/create/page.tsx`
  - [ ] Add "From" recipient selection (Personal/Company)
  - [ ] Add "To" recipient selection (Personal/Company)
  - [ ] Update customer dropdown to show company names
  - [ ] Test invoice creation with company names
  - [ ] **Rollback**: Remove recipient selection from invoice creation

- [ ] **Task 5.2**: Update Invoice Edit Page
  - [ ] Modify `src/app/invoices/[id]/edit/page.tsx`
  - [ ] Add recipient selection functionality
  - [ ] Test invoice editing
  - [ ] **Rollback**: Remove recipient selection from invoice edit

- [ ] **Task 5.3**: Update Invoice Display
  - [ ] Modify invoice display components
  - [ ] Show company names and addresses when selected
  - [ ] Test invoice display
  - [ ] **Rollback**: Revert invoice display to personal names only

### Phase 6: Testing & Validation ✅
- [ ] **Task 6.1**: Database Testing
  - [ ] Test user company information storage
  - [ ] Test customer company information storage
  - [ ] Test invoice recipient selection storage
  - [ ] **Rollback**: Clear test data

- [ ] **Task 6.2**: API Testing
  - [ ] Test all API endpoints with company data
  - [ ] Test search functionality with company names
  - [ ] Test invoice creation with company recipients
  - [ ] **Rollback**: Revert API changes

- [ ] **Task 6.3**: UI Testing
  - [ ] Test settings page company information
  - [ ] Test customer management with company names
  - [ ] Test invoice creation and editing
  - [ ] Test search functionality
  - [ ] **Rollback**: Revert UI changes

### Phase 7: Documentation & Cleanup ✅
- [ ] **Task 7.1**: Update TypeScript Interfaces
  - [ ] Update type definitions in `src/types/index.ts`
  - [ ] Ensure type safety across all components
  - [ ] **Rollback**: Revert type changes

- [ ] **Task 7.2**: Code Review
  - [ ] Review all changes for consistency
  - [ ] Check for any breaking changes
  - [ ] **Rollback**: Address any issues found

- [ ] **Task 7.3**: Final Testing
  - [ ] End-to-end testing of complete feature
  - [ ] Test with existing data (after database deletion)
  - [ ] **Rollback**: Full feature rollback if needed

---

## 🔄 Rollback Procedures

### Quick Rollback (Single Task)
1. Identify the specific task that needs rollback
2. Use git to revert changes for that specific file
3. Test that the rollback works correctly
4. Update task status in this document

### Full Feature Rollback
1. `git checkout HEAD~1` (or appropriate commit)
2. Delete any new database fields manually
3. Clear any cached data
4. Restart the application
5. Verify all functionality works as before

### Database Rollback
1. Connect to MongoDB
2. Remove company fields from collections:
   - `users` collection: Remove `companyName`, `companyAddress`
   - `customers` collection: Remove `companyName`, `hasCompany`
   - `invoices` collection: Remove `recipientType`, `recipientName`, `fromCompany`

---

## 📝 Notes
- All company fields are optional to maintain backward compatibility
- Database deletion will be done before starting implementation
- Each task should be completed and tested before moving to the next
- Rollback procedures are available for each task
- This document will be updated as tasks are completed

---

## ✅ Completion Status
- **Phase 1**: Database Models - ✅ Complete
- **Phase 2**: API Routes - ⏳ Pending  
- **Phase 3**: User Interface - Settings - ⏳ Pending
- **Phase 4**: User Interface - Customer Management - ⏳ Pending
- **Phase 5**: User Interface - Invoice Management - ⏳ Pending
- **Phase 6**: Testing & Validation - ⏳ Pending
- **Phase 7**: Documentation & Cleanup - ⏳ Pending

**Overall Progress**: 14% Complete (1/7 phases)
