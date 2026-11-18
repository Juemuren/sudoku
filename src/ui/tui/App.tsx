import { Box, useWindowSize } from "ink";
import { gameStats } from "../../app/gameStats.ts";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { HorizontalRule, VerticalRule } from "./components/Rules.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { SudokuBoard } from "./components/SudokuBoard.tsx";
import { useGameSession } from "./hooks/useGameSession.ts";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CONTENT_WIDTH,
  EXPANDED_COMPACT_MIN_ROWS,
  RULE_GAP,
  SCREEN_PADDING,
  SCREEN_WIDTH,
  SECTION_GAP,
  SIDEBAR_WIDTH,
} from "./layout.ts";

export function App() {
  const { columns, rows } = useWindowSize();
  const { game, now, showHelp, archive } = useGameSession(columns, rows);
  const { badCells, solved, remaining, elapsedSeconds } = gameStats(game, now);
  const compact = columns < SCREEN_WIDTH;
  const collapsed = compact && rows < EXPANDED_COMPACT_MIN_ROWS;
  const showBoard = !(collapsed && showHelp);

  return (
    <Box
      width={columns}
      height={rows}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        flexDirection="column"
        alignItems="center"
        width={Math.min(columns, SCREEN_WIDTH)}
        padding={SCREEN_PADDING}
      >
        <Header
          difficulty={game.difficulty}
          elapsedSeconds={elapsedSeconds}
          remaining={remaining}
          hintsUsed={game.hintsUsed}
          compact={compact}
        />
        {!compact && <HorizontalRule width={CONTENT_WIDTH} />}
        {showBoard && (
          <Box
            width="100%"
            justifyContent="center"
            marginTop={compact ? 0 : SECTION_GAP}
            marginBottom={SECTION_GAP}
          >
            <Box width={BOARD_WIDTH} flexShrink={0} flexDirection="column">
              <SudokuBoard game={game} badCells={badCells} />
            </Box>
            {!compact && (
              <>
                <Box marginX={RULE_GAP}>
                  <VerticalRule height={BOARD_HEIGHT} />
                </Box>
                <Box width={SIDEBAR_WIDTH} flexDirection="column">
                  <Sidebar
                    game={game}
                    badCells={badCells}
                    dialog={archive.dialog}
                    busy={archive.busy}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
        {compact && archive.active && (
          <Sidebar
            game={game}
            badCells={badCells}
            dialog={archive.dialog}
            busy={archive.busy}
            compact
          />
        )}
        <Footer
          message={archive.status || (archive.active ? " " : game.message)}
          solved={solved}
          conflictCount={badCells.size}
          compact={compact && !archive.active}
          showHelp={showHelp}
          collapsed={collapsed}
        />
      </Box>
    </Box>
  );
}
