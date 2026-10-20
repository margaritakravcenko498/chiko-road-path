import re
import pathlib

root = pathlib.Path("app/src/main/java")
decl = re.compile(r"(?:final\s+)?(?:int|val|var)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=")
string_re = re.compile(r'"(?:\\.|[^"])*"')

for path in root.rglob("*"):
    if path.suffix not in {".java", ".kt"}:
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    scopes = [set()]
    dups = []
    for n, line in enumerate(text.splitlines(), 1):
        code = string_re.sub('""', line)
        for match in decl.finditer(code):
            name = match.group(1)
            if name in scopes[-1]:
                dups.append((n, name))
            else:
                scopes[-1].add(name)
        for ch in code:
            if ch == "{":
                scopes.append(set())
            elif ch == "}" and len(scopes) > 1:
                scopes.pop()
    if dups:
        print(path.as_posix())
        for n, name in dups:
            print(f"  {n}: {name}")
