# CONTEXT.md

## Project

MyRangeBC (MYRA) — BC Government web application for managing Range Use Plans under the Range Act.

## Ubiquitous Language

### Domain Entities

| Term | Definition |
|------|-----------|
| **Agreement** | A range tenure agreement (Forest File) between the province and one or more Agreement Holders. Identified by `forestFileId`. Contains usage history, clients, and a current Plan. |
| **Plan** | A Range Use Plan (RUP) — the primary document managed in MYRA. Contains pastures, schedules, minister issues, management considerations, additional requirements, and an invasive plant checklist. Has a lifecycle status (draft, submitted, approved, etc.). |
| **Pasture** | A named grazing area within a Plan. Contains plant communities. Has attributes: allowable AUM, PLD percent, grace days. |
| **Plant Community** | A vegetation community within a Pasture. Contains indicator plants, monitoring areas, and plant community actions. Has a community type, elevation, purpose of action. |
| **Schedule** | A grazing schedule or hay cutting schedule within a Plan. Contains schedule entries that specify livestock movements between pastures over time. |
| **Minister Issue** | An issue raised by the Minister (decision maker) on a Plan. Contains actions (with no-graze periods) and references affected pastures. |
| **User** | A person using the system. Has a role (Administrator, Range Officer, Agreement Holder, Decision Maker, Read Only) and may be linked to client numbers. |
| **Agreement Holder (AH)** | A client (rancher) who holds a range agreement. May be primary or secondary. Can submit, confirm, and sign plans. |
| **Range Officer** | Staff member responsible for managing agreements within a zone/district. |
| **Decision Maker** | Staff member (typically District Manager) who makes final decisions on plan status. |
| **Zone** | A geographic management area. Contains a district. Assigned to a Range Officer. |
| **District** | A geographic administrative area containing zones. |

### Plan Lifecycle

| Term | Definition |
|------|-----------|
| **Status** | The current lifecycle state of a Plan. Codes include: SD (Staff Draft), SR (Submitted for Review), RR (Recommend Ready), A (Approved), AC (Awaiting Confirmation), and others. |
| **Confirmation** | An Agreement Holder's formal acceptance of a plan (signature). |
| **Amendment** | A modification to an existing approved plan. Types: Minor (MNA), Mandatory (MA), Initial (A). |
| **Extension** | A request to extend a plan's end date. Requires votes from Agreement Holders. |

### Sub-Entities

| Term | Definition |
|------|-----------|
| **Schedule Entry** | A single row in a grazing or hay cutting schedule. Specifies pasture, livestock type, count, date range, and grace days. |
| **Plant Community Action** | An action to be taken on a plant community (timing, details, type). |
| **Indicator Plant** | A plant species used as an indicator within a plant community, with a measured value. |
| **Monitoring Area** | A geographic point (lat/lng) within a plant community used for rangeland health assessment. |
| **Invasive Plant Checklist** | A boolean checklist on a Plan for invasive plant management practices. |
| **Additional Requirement** | An extra requirement on a Plan, categorized and optionally linked to a URL. |
| **Management Consideration** | A consideration for management of the range use plan area. |

### Technical Terms

| Term | Definition |
|------|-----------|
| **RootState** | The TypeScript type representing the complete Redux store state shape. Derived from `combineReducers()`. |
| **AppThunk** | A type alias for `ThunkAction<ReturnType, RootState, unknown, AnyAction>` — used to type all Redux thunk action creators. |
| **AppDispatch** | The typed dispatch function that includes thunk middleware support. |
| **@ts-nocheck** | A TypeScript directive that disables type checking for an entire file. Being removed phase-by-phase during annotation. |
| **@ts-expect-error** | A per-line TypeScript directive used as a temporary escape hatch during annotation. Each instance is a known type error to be fixed. |
