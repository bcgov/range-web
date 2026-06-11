#!/usr/bin/perl
use strict;
use warnings;

# Transform React.FC<Props> = ({ ... }) => { ... }
# into function Name({ ... }: Props) { ... }

my @files = @ARGV;
for my $file (@files) {
    open(my $fh, '<', $file) or die "Cannot open $file: $!";
    my @lines = <$fh>;
    close($fh);

    my $changed = 0;
    my $i = 0;

    while ($i < @lines) {
        my $line = $lines[$i];

        # Pattern 1: No-props body: const Foo: React.FC = () => {
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC\s*=\s*\(\)\s*=>\s*\{/) {
            $lines[$i] = "${1}${2}function $3() {\n";
            $changed = 1;
            $i++;
            next;
        }

        # Pattern 2: No-props implicit return: const Foo: React.FC = () => (
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC\s*=\s*\(\)\s*=>\s*\(/) {
            $lines[$i] = "${1}${2}function $3() {\n${1}  return (\n";
            $changed = 1;
            $i++;
            next;
        }

        # Pattern 3: Single-line destructuring body: const Foo: React.FC<Props> = ({...}) => {
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC<([^>]+)>\s*=\s*\(\{([^}]*)\}\)\s*=>\s*\{/) {
            $lines[$i] = "${1}${2}function $3({$5}: $4) {\n";
            $changed = 1;
            $i++;
            next;
        }

        # Pattern 4: Single-line destructuring implicit return: const Foo: React.FC<Props> = ({...}) => (
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC<([^>]+)>\s*=\s*\(\{([^}]*)\}\)\s*=>\s*\(/) {
            $lines[$i] = "${1}${2}function $3({$5}: $4) {\n${1}  return (\n";
            $changed = 1;
            $i++;
            next;
        }

        # Pattern 5: (props) style: const Foo: React.FC<Props> = (props) => {
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC<([^>]+)>\s*=\s*\((\w+)\)\s*=>\s*\{/) {
            $lines[$i] = "${1}${2}function $3($5: $4) {\n";
            $changed = 1;
            $i++;
            next;
        }

        # Pattern 6: Single-line implicit return without parens: const Foo: React.FC<Props> = ({...}) => <something>;
        # e.g., export const NullRef: React.FC<NullRefProps> = ({ children }) => <Fragment>{children}</Fragment>;
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC<([^>]+)>\s*=\s*\(\{([^}]*)\}\)\s*=>\s*(\S[\s\S]*);\s*$/) {
            $lines[$i] = "${1}${2}function $3({$5}: $4) {\n${1}  return $6;\n${1}}\n";
            $changed = 1;
            $i++;
            next;
        }

        # Pattern 7: Multi-line destructuring body: const Foo: React.FC<Props> = ({\n  ...\n}) => {
        if ($line =~ /^(\s*)(export\s+)?const\s+(\w+):\s*React\.FC<([^>]+)>\s*=\s*\(\{/) {
                my $indent = $1;
                my $export = $2 // '';
                my $name = $3;
                my $props_type = $4;

            # Collect body lines and find closing }) => {
            my @body_lines;
            my $found_close = 0;
            my $j = $i + 1;

            while ($j < @lines) {
                if ($lines[$j] =~ /^(\s*)\}\s*\)\s*=>\s*(\{|\()/) {
                    my $close_indent = $1;
                    my $open_brace = $2;
                    if ($open_brace eq '{') {
                        # Body style
                        $lines[$i] = "${indent}${export}function $name({\n";
                        # Remove trailing newline from body
                        my $body = join('', @body_lines);
                        $lines[$i] .= "${body}${close_indent}}: $props_type) {\n";
                    } else {
                        # Implicit return
                        $lines[$i] = "${indent}${export}function $name({\n";
                        my $body = join('', @body_lines);
                        $lines[$i] .= "${body}${close_indent}}: $props_type) {\n${close_indent}  return (\n";
                    }
                    $found_close = 1;
                    $changed = 1;
                    $i = $j;
                    last;
                }
                push(@body_lines, $lines[$j]);
                $j++;
            }

            if (!$found_close) {
                # No closing found, keep original
                $i++;
                next;
            }
            $i++;
            next;
        }

        # Pattern 8: Multi-line with nested braces in defaults:
        # This handles Status: status = {}, style = {} in defaults
        # Already tried patterns 3,4,7, none matched because of nested {} in defaults
        # Use single-line regex approach
        $i++;
    }

    if ($changed) {
        open(my $fh_out, '>', $file) or die "Cannot write $file: $!";
        print $fh_out @lines;
        close($fh_out);
    }
}
