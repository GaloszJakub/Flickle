import { useCallback, useState } from 'react'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ErrorNotification } from './components/ErrorNotification'
import { GameBoard } from './components/GameBoard'
import { GameModal } from './components/GameModal'
import { Header } from './components/Header'
import { useMovieGame } from './hooks/useMovieGame'

function App() {
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isGiveUpDialogOpen, setIsGiveUpDialogOpen] = useState(false)

  const {
    guesses,
    currentGuess,
    targetMovie,
    gameStatus,
    stats,
    guessedMovieIds,
    unlockedHints,
    guessesUntilNextHint,
    hasMoreHints,
    isInitializing,
    initError,
    setCurrentGuess,
    submitGuess,
    giveUp,
    resetGame,
    dismissInitError,
    retryInitialization,
  } = useMovieGame()

  const handleGuessChange = useCallback(
    (value: string) => setCurrentGuess(value),
    [setCurrentGuess],
  )

  const handleSearchError = useCallback((message: string) => {
    setSearchError(message)
  }, [])

  const dismissSearchError = useCallback(() => {
    setSearchError(null)
  }, [])

  const isModalOpen = gameStatus !== 'playing' && targetMovie !== null
  const activeError = initError ?? searchError

  const handleRetryInit = useCallback(() => {
    dismissInitError()
    retryInitialization()
  }, [dismissInitError, retryInitialization])

  const handleGiveUpRequest = useCallback(() => {
    setIsGiveUpDialogOpen(true)
  }, [])

  const handleGiveUpCancel = useCallback(() => {
    setIsGiveUpDialogOpen(false)
  }, [])

  const handleGiveUpConfirm = useCallback(() => {
    setIsGiveUpDialogOpen(false)
    giveUp()
  }, [giveUp])

  return (
    <div className="relative min-h-dvh bg-surface text-ink">

      <Header guessCount={guesses.length} />

      {activeError && (
        <ErrorNotification
          message={activeError}
          actionLabel={initError ? 'Spróbuj ponownie' : 'Zamknij'}
          onAction={initError ? handleRetryInit : dismissSearchError}
        />
      )}

      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        guessedMovieIds={guessedMovieIds}
        unlockedHints={unlockedHints}
        guessesUntilNextHint={guessesUntilNextHint}
        hasMoreHints={hasMoreHints}
        isPlaying={gameStatus === 'playing'}
        isInputDisabled={gameStatus !== 'playing' || targetMovie === null}
        isInitializing={isInitializing}
        canGiveUp={gameStatus === 'playing' && !isInitializing && targetMovie !== null}
        onGuessChange={handleGuessChange}
        onGuessSubmit={submitGuess}
        onGiveUp={handleGiveUpRequest}
        onSearchError={handleSearchError}
      />

      <ConfirmDialog
        isOpen={isGiveUpDialogOpen}
        title="Poddajesz się?"
        description="Film dnia zostanie ujawniony i gra się zakończy. Na pewno chcesz kontynuować?"
        confirmLabel="Poddaj się"
        cancelLabel="Gram dalej"
        onConfirm={handleGiveUpConfirm}
        onCancel={handleGiveUpCancel}
      />

      {targetMovie && (
        <GameModal
          isOpen={isModalOpen}
          gameStatus={gameStatus}
          stats={stats}
          targetMovie={targetMovie}
          onPlayAgain={() => void resetGame()}
        />
      )}
    </div>
  )
}

export default App
