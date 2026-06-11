# Functional components + hooks during TypeScript annotation

## Status

Accepted

## Context

ADR 0001 planned to type class components in place with `Component<Props, State>`, deferring migration to function components. During annotation planning, we found:

- 56 class components, most using `connect()` from react-redux
- The annotation plan calls for replacing `connect()` with `useSelector`/`useDispatch` hooks
- Hooks cannot be used in class components
- Doing a connect-to-hooks migration and a class-to-function conversion in separate passes would touch each file twice, doubling risk and review overhead

## Decision

Class components will be converted to function components in the same pass as TypeScript annotation. Each file is touched once: class + PropTypes + `@ts-nocheck` becomes function + typed props + clean `tsc`.

### Conversion rules

- `class Foo extends Component { render() { ... } }` becomes `const Foo = ({ prop1, prop2 }: FooProps) => { ... }`
- `this.props.x` becomes destructured `x`
- `this.state.x` becomes `useState`
- Lifecycle methods (`componentDidMount`, `componentDidUpdate`, etc.) become `useEffect`
- `connect(mapStateToProps, mapDispatchToProps)` becomes `useSelector` + `useDispatch`
- `withRouter()` HOC becomes `useParams`, `useNavigate`, `useLocation`
- PropTypes are deleted; TypeScript interface for props replaces them

### Escape hatch

If a class component's lifecycle logic is too complex to safely convert in one pass, add an interface type and annotate `Component<Props, State>` in place, with a `// TODO: convert to function component` comment. These are tracked and dealt with in a follow-up.

## Consequences

- All 56 class components will be rewritten. Higher risk of behavioral drift than typing in place.
- The codebase becomes homogeneous (all functional components + hooks).
- Redux wiring becomes simpler and more type-safe (`useSelector` infers from `RootState`).
- Future developers only need to learn one component pattern.
- No `useSelector`/`useDispatch` existed in the codebase before; after this effort, all Redux access uses hooks.

## Alternatives considered

- **Type classes in place, defer migration:** Rejected — would need a second pass on 56 files later, doubling total effort. The connect-to-hooks migration was already decided, which forces function components anyway.
- **Convert classes to functions in a pre-pass (no types), then annotate:** Rejected — two diffs per file. The first pass would be untyped function components with PropTypes, requiring immediate re-touching for annotation. Logic-risk in the first pass with no type safety to catch mistakes.
