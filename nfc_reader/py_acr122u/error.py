class NfcError(Exception):
    """Base class for exceptions in this module."""
    pass


class NotInitializedError(NfcError):
    """
    Exception raised when a required part is not initialized
    """

    def __init__(self, message: str) -> None:
        self.message = message


class OptionOutOfRangeError(NfcError):
    """
    Exception raised when you try to access an element not in the `option.options` dictionary
    """

    def __init__(self, message: str) -> None:
        self.message = message


class InstructionFailedError(NfcError):
    """
    Exception raised when the instruction failed
    """

    def __init__(self, message: str, sw1: int, sw2: int) -> None:
        self.message = message
        self.sw1 = sw1
        self.sw2 = sw2

    def __str__(self) -> str:
        return f"{self.message}: sw1 = 0x{self.sw1:02X}, sw2 = 0x{self.sw2:02X}"
